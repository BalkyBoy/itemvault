import { inject, injectable } from 'tsyringe';
import { ItemsRepository } from '@/repositories/items.repo';
import { Items } from '@/models/items.model';
import {
  CreateItemDto,
  ListItemsQueryDto,
  UpdateItemDto,
} from './dto/items.dto';
import { NotFoundError } from '@/shared/errors/app.error';
import { PaginatedResult } from '@/shared/utils/response.util';

@injectable()
export class ItemsService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepo: ItemsRepository
  ) {}

  async listItems(query: ListItemsQueryDto): Promise<PaginatedResult<Items>> {
    const { page, limit, orderBy, orderDir, category, status, search } = query;

    return this.itemsRepo.findFiltered(
      { category, status, search },
      { page, limit, orderBy, orderDir }
    );
  }

  async createItem(userId: string, dto: CreateItemDto): Promise<Items> {
    return this.itemsRepo.create({
      user_id: userId,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      status: dto.status,
    });
  }

  async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateItemDto
  ): Promise<Items> {
    const item = await this.itemsRepo.findByIdForUser(itemId, userId);

    if (!item) {
      throw new NotFoundError('Item not found', 'ITEM_NOT_FOUND');
    }

    return this.itemsRepo.update(itemId, dto);
  }

  async deleteItem(userId: string, itemId: string): Promise<void> {
    const item = await this.itemsRepo.findByIdForUser(itemId, userId);

    if (!item) {
      throw new NotFoundError('Item not found', 'ITEM_NOT_FOUND');
    }

    await this.itemsRepo.delete(itemId);
  }
}
