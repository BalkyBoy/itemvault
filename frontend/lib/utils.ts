import type { Item } from './types';

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));
}

export function groupByCategory(items: Item[]): { category: string; count: number }[] {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const key = item.category || 'Other';
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function countByStatus(items: Item[]) {
  return {
    total: items.length,
    active: items.filter((i) => i.status === 'active').length,
    draft: items.filter((i) => i.status === 'draft').length,
    archived: items.filter((i) => i.status === 'archived').length,
  };
}
