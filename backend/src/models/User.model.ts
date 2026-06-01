import { RelationMappings } from "objection";
import { BaseModel } from "./Base.Model";

export class User extends BaseModel {
    static tableName = 'users';

    email!: string;
    password_hash?: string;
    first_name?: string;
    last_name?: string;
    email_verified!: boolean;
    reset_token?: string;
    reset_token_expires_at?: Date;

    get fullName(): string {
        return [this.first_name, this.last_name].filter(Boolean).join('')
    }

    static get relationMappings() : RelationMappings {
        const {Items} = require('./items.model');
        return {

            items: {
                relation: BaseModel.HasManyRelation,
                modelClass: Items,
                join: {
                  from: "users.id",
                  to: "items.user_id",
                },
              },
        }
        
    }
}