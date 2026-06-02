'use client';

import React from 'react';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Users, Mail, ShieldAlert, CircleAlert } from 'lucide-react';

const users = [
  {
    name: 'Balochistan Admin Officer',
    email: 'admin@balochistan.gov.pk',
    role: 'admin',
    joined: 'May 10, 2026',
  },
  {
    name: 'Sardar Khan Baloch',
    email: 'citizen@balochistan.gov.pk',
    role: 'citizen',
    joined: 'June 01, 2026',
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans">User Management</h1>
          <p className="text-xs text-gray-500 mt-1">Review accounts, roles, and security access logs.</p>
        </div>
      </div>

      {/* Info Warning */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-2xl flex gap-3 text-xs leading-relaxed font-semibold">
        <CircleAlert className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <span>Default seeded test credentials are shown below. Under credentials provider configurations, these credentials will bypass database operations in both offline and online states to allow immediate evaluation.</span>
        </div>
      </div>

      {/* Grid listing table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-left text-xs font-bold text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/40 text-gray-500 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-4">User Name</th>
              <th className="px-5 py-4">Email Address</th>
              <th className="px-5 py-4">Registry Date</th>
              <th className="px-5 py-4 text-right">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((u, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                <td className="px-5 py-4 text-gray-900 dark:text-gray-100">{u.name}</td>
                <td className="px-5 py-4 font-semibold text-gray-500 flex items-center gap-1.5 pt-4">
                  <Mail className="h-3.5 w-3.5" />
                  {u.email}
                </td>
                <td className="px-5 py-4 font-semibold text-gray-1000">{u.joined}</td>
                <td className="px-5 py-4 text-right">
                  <Badge variant={u.role === 'admin' ? 'success' : 'default'}>
                    {u.role}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
