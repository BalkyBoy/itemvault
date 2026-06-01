'use client';

import { AuthProvider } from './AuthContext';
import { ItemsProvider } from './ItemsContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ItemsProvider>
        {children}
      </ItemsProvider>
    </AuthProvider>
  );
}
