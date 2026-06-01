import { Card } from './ui';

export function CategoryAnalytics({
  categories,
  total,
}: {
  categories: { category: string; count: number }[];
  total: number;
}) {
  return (
    <Card hover={false}>
      <h2 className="text-base font-semibold text-[#111111]">Category analytics</h2>
      <p className="mt-1 text-sm text-[#525252]">Distribution across your inventory</p>

      {categories.length === 0 ? (
        <p className="mt-8 text-center text-sm text-[#737373]">
          No category data yet
        </p>
      ) : (
        <ul className="mt-6 space-y-5">
          {categories.map(({ category, count }) => {
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <li key={category}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#111111]">{category}</span>
                  <span className="text-[#737373]">
                    {count} · {percent}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
                  <div
                    className="h-full rounded-full bg-[#111111] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
