import { BaseModel } from "./Base.Model";

export class Category extends BaseModel {
    static tableName = 'Category';

    name!: string;

}