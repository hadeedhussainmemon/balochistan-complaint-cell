'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import { User, Mail, Key, UserPlus } from 'lucide-react';
import { registerUserAction } from '@/app/actions';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUserAction({ name, email, password });
      if (res.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 bg-transparent transition-colors duration-300 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 py-8 w-full">
          <Card variant="premium" className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Create Account</h2>
                <p className="text-xs text-gray-500 font-semibold">Join the Balochistan Connect e-governance & citizen tracking portal.</p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200/50 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-755 dark:text-green-400 border border-green-200/50 text-xs font-semibold text-center animate-pulse">
                  {success}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Full Name</label>
                <div className="relative">
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 rounded-xl"
                    required
                  />
                  <div className="absolute left-3.5 top-3.5 text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Email Address</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@example.com"
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Confirm Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                <UserPlus className="h-4 w-4 text-secondary" />
                Sign Up
              </Button>

              <div className="pt-4 text-center text-xs font-bold text-gray-500 border-t border-gray-150 dark:border-gray-800">
                Already have an account?{' '}
                <Link href="/login" className="text-primary dark:text-accent hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
