'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  createItem,
  deleteItem,
  fetchItems as apiFetchItems,
  getDashboardStats,
  getRecentItems,
} from '@/lib/api';
import type {
  CreateItemPayload,
  DashboardStats,
  Item,
  ListItemsParams,
  PaginationMeta,
} from '@/lib/types';



interface ItemsContextValue {
  items: Item[];
  recentItems: Item[];
  stats: DashboardStats | null;
  meta: PaginationMeta | undefined;
  loadingItems: boolean;
  loadingStats: boolean;
  error: string | null;
  fetchItems: (filters?: ListItemsParams) => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  addItem: (data: CreateItemPayload) => Promise<Item>;
  removeItem: (id: string) => Promise<void>;
  refreshStats: () => Promise<void>;
}



const ItemsContext = createContext<ItemsContextValue | null>(null);



export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (filters: ListItemsParams = {}) => {
    setLoadingItems(true);
    setError(null);
    try {
      const result = await apiFetchItems(filters);
      setItems(result.items);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {

    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoadingItems(true);
    setLoadingStats(true);
    setError(null);
    try {
      const [recent, dashStats] = await Promise.all([
        getRecentItems(),
        getDashboardStats(),
      ]);
      setRecentItems(recent);
      setStats(dashStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoadingItems(false);
      setLoadingStats(false);
    }
  }, []);

  const addItem = useCallback(async (data: CreateItemPayload): Promise<Item> => {
    const newItem = await createItem(data);

    setItems((prev) => [newItem, ...prev]);
    setRecentItems((prev) => [newItem, ...prev].slice(0, 6));
    refreshStats();
    return newItem;
  }, [refreshStats]);

  const removeItem = useCallback(async (id: string) => {
  
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRecentItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteItem(id);
      refreshStats();
    } catch (err) {
      // Rollback is not trivial without the original item; re-fetch instead
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      fetchItems();
    }
  }, [refreshStats, fetchItems]);

  return (
    <ItemsContext.Provider
      value={{
        items,
        recentItems,
        stats,
        meta,
        loadingItems,
        loadingStats,
        error,
        fetchItems,
        fetchDashboardData,
        addItem,
        removeItem,
        refreshStats,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}


export function useItemsContext(): ItemsContextValue {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error('useItemsContext must be used within ItemsProvider');
  return ctx;
}
