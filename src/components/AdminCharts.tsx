'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';

interface ComplaintItem {
  status: string;
  category: string;
  createdAt: string;
  district: string;
}

interface AdminChartsProps {
  complaints: ComplaintItem[];
}

const COLORS = ['#0f766e', '#d4a017', '#38bdf8', '#ef4444', '#10b981', '#6366f1'];

export default function AdminCharts({ complaints }: AdminChartsProps) {
  
  // 1. Prepare monthly trend data (mocking month bins based on createdAt dates)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts: Record<string, number> = {};

    complaints.forEach((c) => {
      const date = new Date(c.createdAt);
      const monthLabel = months[date.getMonth()];
      counts[monthLabel] = (counts[monthLabel] || 0) + 1;
    });

    // Make sure we have current and past months displayed
    const currentMonthIdx = new Date().getMonth();
    const displayMonths = months.slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1);

    return displayMonths.map((m) => ({
      name: m,
      Complaints: counts[m] || 0,
    }));
  }, [complaints]);

  // 2. Prepare category breakdown
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    return Object.keys(counts).map((cat) => ({
      name: cat.split(' ')[0], // short name
      fullName: cat,
      Count: counts[cat],
    })).sort((a, b) => b.Count - a.Count).slice(0, 5); // top 5
  }, [complaints]);

  // 3. Prepare status distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      const statusLabel = c.status.replace('_', ' ').toUpperCase();
      counts[statusLabel] = (counts[statusLabel] || 0) + 1;
    });

    return Object.keys(counts).map((status) => ({
      name: status,
      value: counts[status],
    }));
  }, [complaints]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
      
      {/* Area Chart: Monthly Trend (Col 8) */}
      <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Submission Trend</h4>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Monthly volume of registered citizen complaints.</p>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorComplaints" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="Complaints" stroke="#0f766e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorComplaints)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Status Share (Col 4) */}
      <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Status Breakdown</h4>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Audit allocations of closed, active and resolved complaints.</p>
        </div>
        <div className="h-[200px] w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legends list */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
          {statusData.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-650 dark:text-gray-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
              <span>{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Category Volume (Col 12) */}
      <div className="lg:col-span-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Top Civic Issues Categories</h4>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Distribution of reports by major municipal departments.</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
              <Bar dataKey="Count" fill="#0f766e" radius={[8, 8, 0, 0]} maxBarSize={45}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
