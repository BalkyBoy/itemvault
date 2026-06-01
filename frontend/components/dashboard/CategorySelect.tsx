'use client';

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Search, Tag } from 'lucide-react';
import { CATEGORIES } from '@/lib/status';


const CATEGORY_ICONS: Record<string, string> = {
  'Electronics':          '💻',
  'Furniture':            '🪑',
  'Books':                '📚',
  'Clothing':             '👕',
  'Shoes & Footwear':     '👟',
  'Sports & Outdoors':    '⚽',
  'Home & Kitchen':       '🏠',
  'Toys & Games':         '🎮',
  'Health & Beauty':      '💊',
  'Automotive':           '🚗',
  'Garden & Tools':       '🌱',
  'Office Supplies':      '📎',
  'Musical Instruments':  '🎸',
  'Art & Crafts':         '🎨',
  'Pet Supplies':         '🐾',
  'Baby & Kids':          '🍼',
  'Jewelry & Watches':    '💍',
  'Food & Beverages':     '🍔',
  'Travel & Luggage':     '✈️',
  'Other':                '📦',
};



interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  allowAll?: boolean;
  allLabel?: string;
}



export function CategorySelect({
  value,
  onChange,
  error,
  label = 'Category',
  required,
  allowAll = false,
  allLabel = 'All categories',
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const baseList = CATEGORIES.map((c) => ({ value: c, label: c, icon: CATEGORY_ICONS[c] ?? '📦' }));

  const filtered = baseList.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus();
        setFocusedIndex(-1);
      }, 10);
    } else {
      setSearch('');
    }
  }, [open]);

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

  const select = useCallback(
    (cat: string) => {
      onChange(cat);
      setOpen(false);
    },
    [onChange]
  );

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      select(filtered[focusedIndex].value);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const selectedIcon = value ? (CATEGORY_ICONS[value] ?? '📦') : null;
  const triggerLabel = value
    ? value
    : allowAll
    ? allLabel
    : 'Select a category';

  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#111111]">
          {label}
          {required && <span className="text-[#EF4444]"> *</span>}
        </label>
      )}

      {/* Trigger button */}
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
        <span className="flex items-center gap-2.5 min-w-0">
          {selectedIcon ? (
            <span className="text-base leading-none shrink-0">{selectedIcon}</span>
          ) : allowAll ? (
            <Tag className="h-4 w-4 shrink-0 text-[#9CA3AF]" strokeWidth={1.75} />
          ) : (
            <Tag className="h-4 w-4 shrink-0 text-[#9CA3AF]" strokeWidth={1.75} />
          )}
          <span className={`truncate ${value || allowAll ? 'text-[#111111]' : 'text-[#9CA3AF]'}`}>
            {triggerLabel}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>

      {/* Error */}
      {error && <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_10px_24px_-4px_rgba(0,0,0,0.08)]"
          style={{ animation: 'categoryDropdownIn 0.15s ease-out' }}
        >
          {/* Search */}
          <div className="border-b border-[#F1F5F9] p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" strokeWidth={2} />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setFocusedIndex(0); }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search categories..."
                className="h-8 w-full rounded-lg border border-[#E5E7EB] bg-[#F8F9FB] pl-8 pr-3 text-xs text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Categories"
            className="overflow-y-auto py-1.5"
            style={{ maxHeight: '250px' }}
          >
            {allowAll && !search && (
              <li className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] select-none">
                {allLabel}
              </li>
            )}
            {filtered.length === 0 ? (
              <li className="flex flex-col items-center gap-1.5 px-4 py-6 text-center">
                <span className="text-2xl">🔍</span>
                <span className="text-sm text-[#737373]">No categories found</span>
              </li>
            ) : (
              filtered.map((item, i) => {
                const isSelected = item.value === value;
                const isFocused = i === focusedIndex;
                return (
                  <li
                    key={item.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => select(item.value)}
                    onMouseEnter={() => setFocusedIndex(i)}
                    className={`mx-1.5 flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-[#F3F4F6] text-[#111111]'
                        : isFocused
                        ? 'bg-[#F8F9FB] text-[#111111]'
                        : 'text-[#374151] hover:bg-[#F8F9FB]'
                    }`}
                  >
                    <span className="text-base leading-none w-5 text-center shrink-0">
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#111111]" strokeWidth={2.5} />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes categoryDropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}
