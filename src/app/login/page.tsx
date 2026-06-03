'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import { LogIn, Key, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || 'Invalid email or password.');
      } else {
        router.refresh();
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const autofill = (role: 'admin' | 'citizen') => {
    if (role === 'admin') {
      setEmail('admin@balochistan.gov.pk');
      setPassword('admin123');
    } else {
      setEmail('citizen@balochistan.gov.pk');
      setPassword('citizen123');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card variant="premium" className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Staff & Citizen Portal</h2>
            <p className="text-xs text-gray-500 font-semibold">Sign in to report complaints or access administrative dashboards.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Email Address</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="name@balochistan.gov.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-xl"
                required
              />
              <div className="absolute left-3.5 top-3.5 text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Password</label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 rounded-xl"
                required
              />
              <div className="absolute left-3.5 top-3.5 text-gray-400">
                <Key className="h-4 w-4" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            className="w-full text-xs py-3 font-extrabold flex items-center justify-center gap-1.5 mt-2 rounded-xl"
          >
            <LogIn className="h-4 w-4 text-secondary" />
            Sign In
          </Button>

          <div className="text-center text-xs font-bold text-gray-500 pt-1">
            New citizen?{' '}
            <Link href="/register" className="text-primary dark:text-accent hover:underline">
              Create an account
            </Link>
          </div>

          {/* Seeding Demo quick autofills */}
          <div className="pt-5 border-t border-gray-200 dark:border-gray-800 space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
              <span className="text-[10px] font-black uppercase text-gray-400">Demo Testing Fast Login</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => autofill('admin')}
                className="py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary dark:text-accent dark:border-accent/20 dark:bg-accent/5 font-extrabold transition-all duration-200"
              >
                Autofill Admin
              </button>
              <button
                type="button"
                onClick={() => autofill('citizen')}
                className="py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 font-extrabold transition-all duration-200"
              >
                Autofill Citizen
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 bg-transparent transition-colors duration-300 flex items-center justify-center">
        <Suspense fallback={
          <div className="text-center font-bold text-gray-500 py-16">
            Loading Login Parameters...
          </div>
        }>
          <LoginContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
