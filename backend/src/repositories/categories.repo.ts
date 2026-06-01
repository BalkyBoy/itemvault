import { injectable } from 'tsyringe';
import { BaseRepository } from './base.repo';
import { Category } from '@/models/Categories.model';

@injectable()
export class CategoriesRepository extends BaseRepository<Category> {
  constructor() {
    super(Category);
  }

  async findAll(): Promise<Category[]> {
    return this.model.query().orderBy('name', 'asc') as unknown as Promise<Category[]>;
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.model
      .query()
      .where('name', name)
      .first() as unknown as Promise<Category | undefined>;
  }
}
