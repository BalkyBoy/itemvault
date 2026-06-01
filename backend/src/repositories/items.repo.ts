import { injectable } from 'tsyringe';
import { QueryBuilder } from 'objection';
import { BaseRepository, QueryOptions } from './base.repo';
import { Items } from '@/models/items.model';
import { ProductStatus } from '@/shared/enums/generic.enum';
import { PaginatedResult } from '@/shared/utils/response.util';

export interface ListItemsFilters {
  search?: string;
  category?: string;
  status?: ProductStatus;
}

@injectable()
export class ItemsRepository extends BaseRepository<Items> {
  constructor() {
    super(Items);
  }

  async findFiltered(
    filters: ListItemsFilters,
    options: QueryOptions = {}
  ): Promise<PaginatedResult<Items>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const offset = (page - 1) * limit;

    const applyFilters = (query: QueryBuilder<Items, Items[]>) => {
      if (filters.category) {
        query.where('category', filters.category);
      }

      if (filters.status) {
        query.where('status', filters.status);
      }

      if (filters.search) {
        const term = `%${filters.search}%`;
        query.where((builder) => {
          builder
            .where('name', 'ilike', term)
            .orWhere('description', 'ilike', term);
        });
      }

      return query;
    };

    let dataQuery = applyFilters(Items.query());
    const countQuery = applyFilters(Items.query());

    if (options.orderBy) {
      dataQuery = dataQuery.orderBy(options.orderBy, options.orderDir || 'asc');
    }

    const [data, countResult] = await Promise.all([
      dataQuery.offset(offset).limit(limit),
      countQuery.count('* as count').first(),
    ]);

    const total = Number((countResult as unknown as { count: string })?.count || 0);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async findByIdForUser(id: string, userId: string): Promise<Items | undefined> {
    return Items.query().findById(id).where('user_id', userId).first();
  }
}
