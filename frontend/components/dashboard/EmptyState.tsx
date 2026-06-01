import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card } from './ui';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card hover={false} className="flex flex-col items-center py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F9FB] text-[#525252]">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-[#111111]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#525252]">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-[#1a1a1a]"
        >
          {actionLabel}
        </Link>
      )}
    </Card>
  );
}
