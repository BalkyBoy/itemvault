'use client';

import { useEffect, useMemo, useState } from 'react';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PageHeader, PrimaryButton } from '@/components/dashboard/ui';
import { CategorySelect } from '@/components/dashboard/CategorySelect';
import { StatusSelect } from '@/components/dashboard/StatusSelect';
import { useItems } from '@/hooks/useItems';
import type { ItemStatus } from '@/lib/types';
import { Package, Search } from 'lucide-react';
import Link from 'next/link';

export default function ItemsPage() {
  const { items, loadingItems, error, fetchItems, removeItem } = useItems();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<ItemStatus | ''>('');

  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  
  const filters = useMemo(
    () => ({
      limit: 10,
      search: debouncedSearch || undefined,
      category: category || undefined,
      status: status || undefined,
      orderDir: 'desc' as const,
    }),
    [debouncedSearch, category, status]
  );

  useEffect(() => {
    fetchItems(filters);
  }, [fetchItems, JSON.stringify(filters)]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return Array.from(set).sort();
  }, [items]);

  return (
    <>
      <PageHeader
        title="Items"
        description="Search, filter, and manage your inventory"
        action={
          <Link href="/dashboard/items/new">
            <PrimaryButton>Add item</PrimaryButton>
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
          <input
            type="search"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111111] placeholder:text-[#737373] outline-none transition-shadow focus:border-[#111111] focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-44">
            <CategorySelect
              value={category}
              onChange={setCategory}
              label=""
              allowAll
              allLabel="All categories"
            />
          </div>
          <div className="w-36">
            <StatusSelect
              value={status}
              onChange={(val) => setStatus(val as ItemStatus | '')}
              label=""
              allowAll
              allLabel="All statuses"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loadingItems ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No items found"
          description={
            debouncedSearch || category || status
              ? 'Try adjusting your search or filters to find what you are looking for.'
              : 'Get started by adding your first item to the catalog.'
          }
          actionLabel="Add item"
          actionHref="/dashboard/items/new"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={removeItem} />
          ))}
        </div>
      )}
    </>
  );
}
