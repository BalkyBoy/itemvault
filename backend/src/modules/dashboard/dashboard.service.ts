import { inject, injectable } from 'tsyringe';
import { ItemsRepository } from '@/repositories/items.repo';
import { Items } from '@/models/items.model';

export interface DashboardStats {
  total: number;
  totalContributors: number;
  totalCategories: number;
  addedToday: number;
  categories: Record<string, number>;
}

@injectable()
export class DashboardService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepo: ItemsRepository
  ) {}

  async getStats(): Promise<DashboardStats> {
    const items = await this.itemsRepo.findAll();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const contributorSet = new Set<string>();
    const categorySet = new Set<string>();
    const categoryCounts: Record<string, number> = {};
    let addedToday = 0;

    for (const item of items) {
      if (item.user_id) contributorSet.add(item.user_id);

      const cat = item.category || 'Other';
      categorySet.add(cat);
      categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;

      if (new Date(item.created_at) >= todayStart) addedToday++;
    }

    return {
      total: items.length,
      totalContributors: contributorSet.size,
      totalCategories: categorySet.size,
      addedToday,
      categories: categoryCounts,
    };
  }

  async getRecentItems(limit = 6): Promise<Items[]> {
    return this.itemsRepo.findAll(
      undefined,
      { orderBy: 'created_at', orderDir: 'desc', limit }
    );
  }
}
