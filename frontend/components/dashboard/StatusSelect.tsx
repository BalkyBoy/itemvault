'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { STATUS_FILTER_OPTIONS } from '@/lib/status';
import type { ItemStatus } from '@/lib/types';


const STATUS_CONFIG: Record<
  string,
  { icon: string; dot: string; label: string }
> = {
  active: {
    icon: '🟢',
    dot: 'bg-emerald-500',
    label: 'Published',
  },
  draft: {
    icon: '🟡',
    dot: 'bg-amber-400',
    label: 'Draft',
  },
  archived: {
    icon: '⚫',
    dot: 'bg-[#9CA3AF]',
    label: 'Archived',
  },
};



interface StatusSelectProps {
  value: ItemStatus | '';
  onChange: (value: ItemStatus | '') => void;
  label?: string;
  error?: string;
  allowAll?: boolean;
  allLabel?: string;
  options?: { value: ItemStatus | ''; label: string }[];
}



export function StatusSelect({
  value,
  onChange,
  label = 'Status',
  error,
  allowAll = false,
  allLabel = 'All statuses',
  options,
}: StatusSelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const baseOptions = options ?? STATUS_FILTER_OPTIONS;
  const items = baseOptions.filter((o) => o.value !== '') as { value: ItemStatus; label: string }[];

  // Reset focus index on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const idx = items.findIndex((o) => o.value === value);
        setFocusedIndex(idx >= 0 ? idx : 0);
      }, 0);
    }
  }, [open, items, value]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (val: ItemStatus) => {
    onChange(val);
    setOpen(false);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      select(items[focusedIndex].value);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const current = value ? STATUS_CONFIG[value] : null;
  const triggerLabel = value ? (current?.label ?? value) : allLabel;

  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#111111]">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-sm transition-all outline-none ${
          error
            ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
            : open
            ? 'border-[#111111] ring-2 ring-black/5'
            : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
        }`}
      >
        <span className="flex items-center gap-2.5">
          {current ? (
            <span className={`h-2 w-2 shrink-0 rounded-full ${current.dot}`} />
          ) : (
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#D1D5DB]" />
          )}
          <span className={value ? 'text-[#111111]' : 'text-[#6B7280]'}>
            {triggerLabel}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          strokeWidth={1.75}
        />
      </button>

      {/* Error */}
      {error && <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_10px_24px_-4px_rgba(0,0,0,0.08)]"
          style={{ animation: 'statusDropdownIn 0.15s ease-out' }}
        >
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Status options"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="py-1.5 outline-none"
          >
            {allowAll && (
              <li className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] select-none">
                {allLabel}
              </li>
            )}
            {items.map((opt, i) => {
              const cfg = STATUS_CONFIG[opt.value];
              const isSelected = opt.value === value;
              const isFocused = i === focusedIndex;

              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  onMouseEnter={() => setFocusedIndex(i)}
                  className={`mx-1.5 flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#F3F4F6] text-[#111111]'
                      : isFocused
                      ? 'bg-[#F8F9FB] text-[#111111]'
                      : 'text-[#374151] hover:bg-[#F8F9FB]'
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      cfg ? cfg.dot : 'bg-[#D1D5DB]'
                    }`}
                  />
                  <span className="flex-1 font-medium">{opt.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#111111]" strokeWidth={2.5} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes statusDropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}
