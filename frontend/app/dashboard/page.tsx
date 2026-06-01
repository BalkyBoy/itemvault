'use client';

import { useEffect } from 'react';
import { CategoryAnalytics } from '@/components/dashboard/CategoryAnalytics';
import { ItemRow } from '@/components/dashboard/ItemCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, PageHeader } from '@/components/dashboard/ui';
import { useItems } from '@/hooks/useItems';
import { groupByCategory } from '@/lib/utils';
import { CalendarPlus, Layers, Package, Users } from 'lucide-react';

export default function DashboardPage() {
  const {
    stats,
    recentItems,
    loadingItems,
    loadingStats,
    error,
    fetchDashboardData,
  } = useItems();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const loading = loadingItems || loadingStats;
  const categories = groupByCategory(recentItems);

  return (
    <>
      <PageHeader
        title="Collection Stats"
        description="Overview of your inventory and recent activity"
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Items"
          value={loading ? '—' : (stats?.total ?? 0)}
          icon={Package}
          hint="All items ever added"
        />
        <StatCard
          label="Total Contributors"
          value={loading ? '—' : (stats?.totalContributors ?? 0)}
          icon={Users}
          hint="Users who have added items"
        />
        <StatCard
          label="Categories"
          value={loading ? '—' : (stats?.totalCategories ?? 0)}
          icon={Layers}
          hint="Distinct categories in use"
        />
        <StatCard
          label="Items Added Today"
          value={loading ? '—' : (stats?.addedToday ?? 0)}
          icon={CalendarPlus}
          hint="Daily activity"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Card hover={false} className="lg:col-span-3">
          <h2 className="text-base font-semibold text-[#111111]">Recent items</h2>
          <p className="mt-1 text-sm text-[#525252]">Latest updates in your catalog</p>

          {loading ? (
            <div className="mt-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-[#F8F9FB]" />
              ))}
            </div>
          ) : recentItems.length === 0 ? (
            <p className="mt-8 text-center text-sm text-[#737373]">
              No items yet. Add your first item to get started.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#F1F5F9]">
              {recentItems.map((item) => (
                <li key={item.id}>
                  <ItemRow item={item} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="lg:col-span-2">
          <CategoryAnalytics
            categories={
              stats?.categories
                ? Object.entries(stats.categories).map(([category, count]) => ({
                    category,
                    count,
                  }))
                : categories
            }
            total={stats?.total ?? 0}
          />
        </div>
      </div>
    </>
  );
}
