import { injectable } from "tsyringe";
import { BaseRepository, QueryOptions } from "./base.repo";
import { User } from "@/models/User.model";

@injectable()
export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.model.query()
            .where('email', email.toLowerCase())
            .first() as unknown as Promise<User | undefined>;
    }
}