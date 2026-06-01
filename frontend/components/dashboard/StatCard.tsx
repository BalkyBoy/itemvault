import type { LucideIcon } from 'lucide-react';
import { Card } from './ui';

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#525252]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#111111]">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-[#737373]">{hint}</p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F9FB] text-[#111111]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </Card>
  );
}
