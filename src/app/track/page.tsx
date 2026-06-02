'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import SafeMap from '@/components/DynamicMap';
import { getComplaintByTrackingIdAction } from '@/app/actions';
import { Search, Clock, MapPin, User, ChevronRight, Clipboard, Calendar, FileText, CheckCircle } from 'lucide-react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id') || '';

  const [trackingId, setTrackingId] = useState(initialId);
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    // Update URL query parameter
    router.replace(`/track?id=${trackingId.toUpperCase().trim()}`);
    handleSearch(trackingId);
  };

  const handleSearch = async (id: string) => {
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await getComplaintByTrackingIdAction(id);
      if (res.success && res.data) {
        setComplaint(res.data);
      } else {
        setComplaint(null);
        setError(res.error || 'No complaint found matching that Tracking ID.');
      }
    } catch (err: any) {
      setComplaint(null);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Status index mapping
  const statuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];
  const statusLabels: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  const getCurrentStatusIndex = () => {
    if (!complaint) return -1;
    return statuses.indexOf(complaint.status);
  };

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="space-y-8">
      {/* Tracking Search Card */}
      <Card variant="default" className="p-6 border-gray-200 dark:border-gray-800 max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Enter Tracking ID</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 font-semibold">Enter your 5-digit complaint number (e.g., BAL-93210) to check live progress.</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="e.g. BAL-93210"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="pl-10 uppercase rounded-xl"
                required
              />
              <div className="absolute left-3.5 top-3.5 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
            <Button type="submit" isLoading={loading} variant="primary" className="text-xs py-3 rounded-xl shrink-0">
              Track Status
            </Button>
          </div>
        </form>
      </Card>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-650 border border-red-200/50 rounded-2xl max-w-xl mx-auto text-xs font-bold text-center">
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-40 bg-gray-100 dark:bg-gray-800/40 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-60 bg-gray-100 dark:bg-gray-800/40 rounded-3xl md:col-span-2" />
            <div className="h-60 bg-gray-100 dark:bg-gray-800/40 rounded-3xl" />
          </div>
        </div>
      )}

      {/* Results Detail Panel */}
      {searched && !loading && complaint && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          
          {/* Header Overview Card */}
          <div className="glass-premium border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-secondary">Complaint Registry</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5 select-all">
                {complaint.complaintId}
              </h3>
              <p className="text-[11px] text-gray-500 font-semibold">
                Filed on: {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Current Status</span>
              <Badge variant={complaint.status === 'resolved' || complaint.status === 'closed' ? 'success' : 'warning'}>
                {statusLabels[complaint.status]}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Status Timeline & Info (Col 8) */}
            <div className="md:col-span-8 space-y-8">
              
              {/* Vertical Stepper Timeline */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Status Timeline</h4>
                
                <div className="relative border-l border-gray-200 dark:border-gray-800 pl-6 sm:pl-8 space-y-8">
                  {statuses.map((s, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    return (
                      <div key={s} className="relative group">
                        
                        {/* Timeline Ring Dot */}
                        <div
                          className={`absolute -left-[35px] sm:-left-[43px] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-gray-900 border-2 transition-all ${
                            isActive
                              ? 'border-primary bg-primary text-white scale-110 shadow'
                              : isCompleted
                              ? 'border-primary text-primary'
                              : 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        </div>

                        <div className="space-y-1">
                          <h5 className={`text-sm font-extrabold transition-colors ${
                            isActive ? 'text-primary dark:text-accent font-black' : isCompleted ? 'text-gray-800 dark:text-gray-300 font-bold' : 'text-gray-400 dark:text-gray-600'
                          }`}>
                            {statusLabels[s]}
                          </h5>
                          {isActive && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                              This complaint is currently undergoing active {statusLabels[s].toLowerCase()} procedures.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description & Evidence */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Complaint Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-900 dark:text-white">{complaint.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-500">Assigned Department:</span>
                    <span className="text-primary dark:text-accent">{complaint.assignedTo}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-900 dark:text-white">{complaint.area}, {complaint.city} ({complaint.district})</span>
                  </div>
                </div>
                <div className="pt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 font-semibold space-y-1.5">
                  <span className="block font-black text-gray-800 dark:text-white">Issue Description:</span>
                  <p className="bg-gray-50 dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">{complaint.description}</p>
                </div>

                {/* Evidence photos */}
                {complaint.images && complaint.images.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h5 className="text-xs font-black text-gray-800 dark:text-white mb-3">Attached Evidence</h5>
                    <div className="grid grid-cols-3 gap-3">
                      {complaint.images.map((url: string, index: number) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
                          <img src={url} alt="Proof" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Officer logs & Maps (Col 4) */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Interactive map coordinates if available */}
              {complaint.coordinates && (complaint.coordinates.lat || complaint.coordinates.lng) && (
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Report Location Map</h4>
                  <div className="h-[200px] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <SafeMap
                      markers={[
                        {
                          id: complaint._id,
                          lat: complaint.coordinates.lat,
                          lng: complaint.coordinates.lng,
                          title: complaint.category,
                          description: `${complaint.area}, ${complaint.city}`,
                          color: '#e11d48', // Red marker for complaints
                        },
                      ]}
                      center={[complaint.coordinates.lat, complaint.coordinates.lng]}
                      zoom={12}
                    />
                  </div>
                </div>
              )}

              {/* Action logs history */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Departmental Logs</h4>
                {complaint.notes && complaint.notes.length > 0 ? (
                  <div className="space-y-4">
                    {complaint.notes.map((note: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-primary/40 pl-3.5 space-y-1">
                        <p className="text-xs text-gray-650 dark:text-gray-300 font-semibold leading-relaxed">{note.text}</p>
                        <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                          <span>By: {note.author}</span>
                          <span>
                            {new Date(note.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-gray-500 font-semibold">
                    No official notes added yet. Waiting for review officer.
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Default placeholder illustration */}
      {!searched && !loading && (
        <div className="text-center py-20 bg-white/40 dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl max-w-xl mx-auto">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Waiting for Search Query</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto font-medium">
            Enter your tracking code above to retrieve live logs, resolution reports, and assigned departments.
          </p>
        </div>
      )}

    </div>
  );
}

export default function TrackPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
              Operations Center
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-none">
              Track Complaint Status
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto font-medium">
              Monitor updates, assigned authorities, and field notes about your civic issue.
            </p>
          </div>

          <Suspense fallback={
            <div className="max-w-xl mx-auto p-8 text-center font-bold text-gray-500">
              Loading Tracker Parameters...
            </div>
          }>
            <TrackingContent />
          </Suspense>

        </div>
      </main>

      <Footer />
    </>
  );
}
