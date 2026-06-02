import React from 'react';
import * as dbService from '@/lib/dbService';
import AdminCharts from '@/components/AdminCharts';
import Badge from '@/components/ui/badge';
import { 
  ClipboardList, CheckCircle2, AlertTriangle, Percent, 
  MapPin, AlertOctagon, Activity 
} from 'lucide-react';

export const revalidate = 0; // Dynamic, do not cache admin dashboard

export default async function AdminDashboardPage() {
  const complaints = await dbService.getComplaints();

  // Convert mongoose models to JSON
  const serializedComplaints = JSON.parse(JSON.stringify(complaints));

  // Compute operational statistics
  const totalCount = serializedComplaints.length;
  const resolvedCount = serializedComplaints.filter((c: any) => c.status === 'resolved').length;
  const pendingCount = totalCount - resolvedCount; // submitted + under_review + assigned + in_progress + closed (if closed not resolved)
  const resolveRate = totalCount > 0 ? (resolvedCount / totalCount) * 100 : 0;

  // Group items to identify urgent issues
  const urgentCount = serializedComplaints.filter((c: any) => c.priority === 'urgent' && c.status !== 'resolved').length;

  const stats = [
    {
      title: 'Total Complaints',
      value: totalCount,
      description: 'Lifetime registrations',
      icon: <ClipboardList className="h-5 w-5 text-primary" />,
      bg: 'bg-primary/10',
    },
    {
      title: 'Resolved Complaints',
      value: resolvedCount,
      description: 'Maintenance completed',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Pending Resolution',
      value: pendingCount,
      description: 'Active municipal tickets',
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Resolution Rate',
      value: `${resolveRate.toFixed(1)}%`,
      description: 'Completion efficiency',
      icon: <Percent className="h-5 w-5 text-blue-500" />,
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Workspace Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">Live operational statistics and municipal performance metrics.</p>
        </div>
        
        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-650 border border-red-200/50 text-xs font-bold animate-pulse">
            <AlertOctagon className="h-4.5 w-4.5" />
            <span>{urgentCount} Urgent Tickets Active</span>
          </div>
        )}
      </div>

      {/* Numerical Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="p-5 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-bold">{item.title}</span>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{item.value}</p>
              <p className="text-[10px] text-gray-400 font-medium">{item.description}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${item.bg}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Graphs */}
      <AdminCharts complaints={serializedComplaints} />

    </div>
  );
}
