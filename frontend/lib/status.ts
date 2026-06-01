import type { ItemStatus } from './types';

export const STATUS_LABELS: Record<ItemStatus, string> = {
  active: 'Published',
  draft: 'Draft',
  archived: 'Archived',
};

export const STATUS_STYLES: Record<ItemStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  draft: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  archived: 'bg-[#F3F4F6] text-[#525252] ring-[#E5E7EB]',
};

export const STATUS_FILTER_OPTIONS: { value: ItemStatus | ''; label: string }[] =
  [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

export const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Books',
  'Clothing',
  'Shoes & Footwear',
  'Sports & Outdoors',
  'Home & Kitchen',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Garden & Tools',
  'Office Supplies',
  'Musical Instruments',
  'Art & Crafts',
  'Pet Supplies',
  'Baby & Kids',
  'Jewelry & Watches',
  'Food & Beverages',
  'Travel & Luggage',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
