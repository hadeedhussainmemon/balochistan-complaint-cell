import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  LayoutDashboard, ClipboardList, Newspaper, Calendar, 
  MapPin, Users, Settings, Landmark, ShieldCheck 
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
  { name: 'Complaints', href: '/admin/complaints', icon: <ClipboardList className="h-4.5 w-4.5" /> },
  { name: 'News & Announcements', href: '/admin/news', icon: <Newspaper className="h-4.5 w-4.5" /> },
  { name: 'Events Calendar', href: '/admin/events', icon: <Calendar className="h-4.5 w-4.5" /> },
  { name: 'Manage Locations', href: '/admin/locations', icon: <MapPin className="h-4.5 w-4.5" /> },
  { name: 'Team Registry', href: '/admin/team', icon: <Users className="h-4.5 w-4.5" /> },
  { name: 'User Management', href: '/admin/users', icon: <Users className="h-4.5 w-4.5" /> },
  { name: 'Portal Settings', href: '/admin/settings', icon: <Settings className="h-4.5 w-4.5" /> },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  // Security Check: Redirect to login if not logged in or not admin
  if (!session || user?.role !== 'admin') {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Top Header (reuses site navbar for consistent themes) */}
      <Navbar />

      <div className="flex-1 max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Collapsible Sidebar (Col 3) */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          
          {/* Dashboard Meta */}
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-accent border border-primary/20">
              <ShieldCheck className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white leading-none">Admin Workspace</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Level 1 Security clearance</p>
            </div>
          </div>

          {/* Links list */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white transition-colors"
              >
                <span className="text-gray-400 group-hover:text-primary shrink-0">
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

        </aside>

        {/* Content workspace (Col 9) */}
        <main className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          {children}
        </main>

      </div>

    </div>
  );
}
