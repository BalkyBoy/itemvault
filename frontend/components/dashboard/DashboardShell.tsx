'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  X,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/items', label: 'Items', icon: Package },
  { href: '/dashboard/items/new', label: 'Add Item', icon: PlusCircle },
];

function NavLinks({ onNavigate, pathname }: { onNavigate?: () => void; pathname: string }) {
    <>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === '/dashboard'
            ? pathname === href
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-[#F3F4F6] text-[#111111]'
                : 'text-[#525252] hover:bg-[#F8F9FB] hover:text-[#111111]'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </>
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/register');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex">
        <aside className="hidden w-64 shrink-0 border-r border-[#E5E7EB] bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-5 py-8">
            <Link href="/dashboard" className="mb-10 px-3">
              <span className="text-lg font-semibold tracking-tight text-[#111111]">
                Items Vault
              </span>
            </Link>
            <nav className="flex flex-1 flex-col gap-1">
              <NavLinks pathname={pathname} />
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-auto flex items-center gap-2 px-3 text-sm text-[#737373] transition-colors hover:text-[#111111]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Logout
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[#E5E7EB] bg-white px-5 py-8 transition-transform lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="text-lg font-semibold text-[#111111]">Dufil</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-[#525252] hover:bg-[#F3F4F6]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex items-center gap-2 px-3 text-sm text-[#737373] transition-colors hover:text-[#111111]"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Logout
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[#E5E7EB] bg-white/90 px-4 py-4 backdrop-blur-md sm:px-8 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-[#525252] hover:bg-[#F3F4F6]"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-semibold text-[#111111]">Dufil</span>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
