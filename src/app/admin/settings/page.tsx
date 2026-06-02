'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { Settings, ShieldCheck, Mail, Bell, MessageSquare, Database, Sparkles } from 'lucide-react';

const defaultDistricts = [
  'Quetta', 'Gwadar', 'Ziarat', 'Khuzdar', 'Lasbela', 'Hub', 'Sibi', 'Loralai', 'Pishin'
];

export default function AdminSettingsPage() {
  const [districtsList, setDistrictsList] = useState(defaultDistricts);
  const [newDistrict, setNewDistrict] = useState('');

  // Toggles state
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dbBackup, setDbBackup] = useState(false);
  const [mockFallback, setMockFallback] = useState(true);

  const handleAddDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrict.trim()) return;

    if (districtsList.some(d => d.toLowerCase() === newDistrict.toLowerCase().trim())) {
      alert('District already exists!');
      return;
    }

    setDistrictsList(prev => [...prev, newDistrict.trim()]);
    setNewDistrict('');
  };

  const handleRemoveDistrict = (name: string) => {
    setDistrictsList(prev => prev.filter(d => d !== name));
  };

  const handleSaveSettings = () => {
    alert('Global portal settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans">Portal Settings</h1>
          <p className="text-xs text-gray-500 mt-1">Configure global notification pipelines, allowed districts list, and fallback states.</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          variant="primary"
          className="text-xs font-bold rounded-xl py-2.5"
        >
          Save Global Config
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Toggle options (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Notifications config */}
          <Card variant="default" className="p-4 sm:p-6 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary shrink-0" />
              Notification Pipelines
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-secondary shrink-0" />
                    SMS Dispatch Alerts
                  </h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Send tracking updates via SMS when status updates are logged by admin.</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4 bg-transparent border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                    <Mail className="h-4 w-4 text-secondary shrink-0" />
                    Email Status Triggers
                  </h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Automate email replies to submitters when their complaint is marked resolved.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4 bg-transparent border-gray-300"
                />
              </div>
            </div>
          </Card>

          {/* Database & Mockups config */}
          <Card variant="default" className="p-4 sm:p-6 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary shrink-0" />
              System Cache & Fallbacks
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-secondary shrink-0" />
                    Auto Mock Database Fallback
                  </h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Fallback to local mockup state if MONGODB_URI connections fail or time out.</p>
                </div>
                <input
                  type="checkbox"
                  checked={mockFallback}
                  onChange={(e) => setMockFallback(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4 bg-transparent border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                    <Database className="h-4 w-4 text-secondary shrink-0" />
                    Hourly Database Backup
                  </h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Automate incremental data backups to secondary cloud mirrors.</p>
                </div>
                <input
                  type="checkbox"
                  checked={dbBackup}
                  onChange={(e) => setDbBackup(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4 bg-transparent border-gray-300"
                />
              </div>
            </div>
          </Card>

        </div>

        {/* Allowed Districts Setup (Col 5) */}
        <div className="lg:col-span-5">
          <Card variant="default" className="p-4 sm:p-6 border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Active District Registry</h3>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Allowed districts available in the citizen complaint form location selection.</p>
            </div>

            {/* List tags */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {districtsList.map((d) => (
                <div key={d} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200/40">
                  <span>{d}</span>
                  <button
                    onClick={() => handleRemoveDistrict(d)}
                    className="text-red-500 hover:text-red-700 text-[10px] font-black"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add new District form */}
            <form onSubmit={handleAddDistrict} className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Input
                placeholder="District name..."
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" variant="outline" className="text-xs shrink-0 py-2.5">
                Add Tag
              </Button>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
}
