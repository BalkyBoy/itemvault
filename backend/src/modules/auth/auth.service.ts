import { UserRepository } from "@/repositories/user.repo";
import { inject, injectable } from "tsyringe";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { User } from '@/models/User.model';
import { ConflictError, UnauthorizedError } from "@/shared/errors/app.error";
import { hashPassword, verifyPassword } from "@/shared/utils/encrypt.util";
import { throwDeprecation } from "node:process";
import { config } from "@/config";
import { NotFoundError } from "objection";
import { JwtPayload } from '@/shared/middlewares/auth.middleware';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

@injectable()
export class AuthService {
    constructor(
        @inject('UserRepository')
        private userRepo: UserRepository,
    ) { }

    async register(dto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.userRepo.findByEmail(
            dto.email.toLowerCase()
        );

        if (existingUser) {
            throw new ConflictError('Email already registered', 'Email_Exits')
        }

        const passwwordHash = await hashPassword(dto.password)

        const user = await this.userRepo.create({
            email: dto.email.toLowerCase(),
            password_hash: passwwordHash,
            first_name: dto.firstName,
            last_name: dto.lastName,
        })

        const tokens = this.generateTokens(user);

        return { user, tokens };
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await this.userRepo.findByEmail(dto.email.toLowerCase());

        if (!user || !user.password_hash) {
            throw new UnauthorizedError(
                'Invalid email or password',
                'INVALID_CREDENTIALS'
            );
        }

        const isValidPassword = await verifyPassword(dto.password, user.password_hash);

        if (!isValidPassword) {
            throw new UnauthorizedError(
                'Invalid email or password',
                'INVALID_CREDENTIALS'
            );

        }

        const tokens = this.generateTokens(user);

        return { user, tokens };

    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            const payload = jwt.verify(
                refreshToken,
                config.jwt.refreshSecret
            ) as JwtPayload & { type: string };

            if (payload.type !== 'refresh') {
                throw new UnauthorizedError('Invalid refresh token', 'INVALID_TOKEN');
            }

            const user = await this.userRepo.findById(payload.userId);

            if (!user) {
                throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
            }

            return this.generateTokens(user);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                throw error;
            }
            throw new UnauthorizedError('Invalid refresh token', 'INVALID_TOKEN');
        }
    }

    //   async forgotPassword(email: string): Promise<void> {
    //     const user = await this.userRepo.findByEmail(email.toLowerCase());

    //     if (!user) {
    //         return
    //     }

    //     const resetToken = generateRandomToken(32);
    //     const expiresAt = addMinutes(new Date(), 60); // 1 hour

    //     await this.userRepo.setResetToken(user.id, resetToken, expiresAt);
    //   }

    async getMe(userId: string): Promise<User> {
        const user = await this.userRepo.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found')
        }

        return user
    }


    private generateTokens(user: User): AuthTokens {
        const payload: JwtPayload = {
            userId: user.id,
            email: user.email
        };

        const accessToken = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });

        const refreshToken = jwt.sign(
            { ...payload, type: 'refresh' },
            config.jwt.refreshSecret,
            { expiresIn: config.jwt.refreshExpiresIn }
        );

        const expiresInMatch = config.jwt.expiresIn.match(/^(\d+)([dhms])$/);
        let expiresIn = 3600; // default 1 hour

        if (expiresInMatch) {
            const value = parseInt(expiresInMatch[1], 10);
            const unit = expiresInMatch[2];

            switch (unit) {
                case 'd':
                    expiresIn = value * 86400;
                    break;
                case 'h':
                    expiresIn = value * 3600;
                    break;
                case 'm':
                    expiresIn = value * 60;
                    break;
                case 's':
                    expiresIn = value;
                    break;
            }
        }

        return { accessToken, refreshToken, expiresIn };

    }


}