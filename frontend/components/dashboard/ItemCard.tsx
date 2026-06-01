import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Card } from './ui';
import { formatDate } from '@/lib/utils';
import type { Item } from '@/lib/types';

export function ItemCard({ item, onDelete }: { item: Item; onDelete?: (id: string) => void }) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-[#111111]">
            {item.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-[#525252]">
            {item.description}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#F1F5F9] pt-4 text-xs text-[#737373]">
        <div className="flex items-center gap-x-4">
          <span className="font-medium text-[#525252]">{item.category}</span>
          <span>Updated {formatDate(item.updated_at)}</span>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="ml-auto rounded-lg p-1 text-[#9CA3AF] transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Delete item"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </Card>
  );
}

export function ItemRow({ item }: { item: Item }) {
  return (
    <Link
      href="/dashboard/items"
      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-[#F8F9FB]"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#111111]">{item.name}</p>
        <p className="mt-0.5 text-xs text-[#737373]">
          {item.category} · {formatDate(item.created_at)}
        </p>
      </div>
      <StatusBadge status={item.status} />
    </Link>
  );
}
