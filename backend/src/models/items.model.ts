import { Model, RelationMappings } from 'objection';
import { BaseModel } from './Base.Model';
import { ProductStatus } from '@/shared/enums/generic.enum';

export class Items extends BaseModel {
    static tableName = 'items';

    user_id!: string;
    name!: string;
    description!: string;
    category!: string;
    status!: ProductStatus;
    static get relationMappings(): RelationMappings {
        const {User} = require('./User.model');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'items.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}