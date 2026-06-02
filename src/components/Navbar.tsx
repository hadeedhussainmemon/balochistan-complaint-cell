'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from './Providers';
import { Sun, Moon, Menu, X, Landmark, ClipboardList, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Locations', href: '/locations' },
  { name: 'News', href: '/news' },
  { name: 'Events', href: '/events' },
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user as any;
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
                <Landmark className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent dark:from-white dark:to-emerald-400">
                Balochistan<span className="text-secondary dark:text-secondary font-medium">Connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary dark:text-accent bg-primary/5 dark:bg-accent/10'
                      : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions & Profiles */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-secondary" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Quick Submit Complaint */}
            <Link
              href="/complaint"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              <ClipboardList className="h-4 w-4 text-secondary" />
              File Complaint
            </Link>

            {/* Track Button */}
            <Link
              href="/track"
              className="px-3 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Track
            </Link>

            {/* Auth Indicator */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-bold shadow-sm">
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-1 shadow-lg ring-1 ring-black/5 z-50">
                    <div className="px-3 py-2 text-xs border-b border-gray-100 dark:border-gray-800 mb-1">
                      <p className="font-semibold text-gray-500">Logged in as</p>
                      <p className="font-medium text-gray-900 dark:text-gray-200 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent uppercase">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}

          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-secondary" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 shadow-lg z-50 relative">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
                    isActive
                      ? 'text-primary dark:text-accent bg-primary/5 dark:bg-accent/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex flex-col gap-2">
            <Link
              href="/complaint"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center items-center gap-2 w-full py-3 font-semibold text-white bg-primary rounded-xl"
            >
              <ClipboardList className="h-5 w-5 text-secondary" />
              File Complaint
            </Link>

            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center items-center w-full py-2.5 font-semibold rounded-xl border border-gray-300 dark:border-gray-700"
            >
              Track Complaint
            </Link>

            {session ? (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="px-3 py-2 text-sm">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center gap-2 w-full py-2.5 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
