import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from 'express';
import { LoginDto, RefreshTokenDto, RegisterDto } from "./dto/auth.dto";
import { SuccessResponse } from "@/shared/utils/response.util";

@injectable()
export class AuthController {
    constructor(
        @inject('AuthService')
        private authService: AuthService
    ) {}

    register =  async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dto: RegisterDto = req.body;
            const result = await this.authService.register(dto);

            res.status(201).json(
                SuccessResponse('Registration successful', {
                    user: result.user,
                    tokens: result.tokens,
                }) 
            );
        } catch (error) {
            next(error);
        }
    };

    login = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const dto: LoginDto = req.body;
          const result = await this.authService.login( dto);
    
          res.json(
            SuccessResponse('Login successful', {
              user: result.user,
              tokens: result.tokens,
            })
          );
        } catch (error) {
          next(error);
        }
      };
    
      refreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const dto: RefreshTokenDto = req.body;
          const tokens = await this.authService.refreshToken(dto.refreshToken);
    
          res.json(SuccessResponse('Token refreshed', { tokens }));
        } catch (error) {
          next(error);
        }
      };

      getMe = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const user = await this.authService.getMe(req.userId!);
    
          res.json(SuccessResponse('User retrieved', { user }));
        } catch (error) {
          next(error);
        }
      };
    
    
}