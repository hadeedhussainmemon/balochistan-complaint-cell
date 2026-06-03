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
import { getComplaintByTrackingIdAction, getComplaintsByUserAction } from '@/app/actions';
import { Search, Clock, MapPin, User, ChevronRight, Clipboard, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const statuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];
const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

function TrackingContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id') || '';

  const [trackingId, setTrackingId] = useState(initialId);
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Authenticated states
  const [userComplaints, setUserComplaints] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if ((session.user as any).role === 'admin') {
        router.push('/admin');
        return;
      }
      fetchUserComplaints();
    }
  }, [status, session, router]);

  const fetchUserComplaints = async () => {
    setLoadingList(true);
    try {
      const email = session?.user?.email || '';
      const id = (session?.user as any)?.id || '';
      const res = await getComplaintsByUserAction(email, id);
      if (res.success && res.data) {
        setUserComplaints(res.data);
        // If there's an initial ID in URL, select it, else select first complaint in list
        if (initialId) {
          const matched = res.data.find((c: any) => c.complaintId === initialId);
          if (matched) {
            setComplaint(matched);
            setSelectedId(matched.complaintId);
            setSearched(true);
          } else {
            handleSearch(initialId);
          }
        } else if (res.data.length > 0) {
          setComplaint(res.data[0]);
          setSelectedId(res.data[0].complaintId);
          setSearched(true);
        }
      }
    } catch (err) {
      console.error('Error fetching user complaints:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
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
        setSelectedId(res.data.complaintId);
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

  const handleSelectComplaint = (c: any) => {
    setComplaint(c);
    setSelectedId(c.complaintId);
    setSearched(true);
    setError('');
    router.replace(`/track?id=${c.complaintId}`);
  };

  const renderComplaintDetails = (comp: any) => {
    const compStatusIndex = statuses.indexOf(comp.status);
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Header Overview Card */}
        <div className="glass-premium border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-secondary">Complaint Registry</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5 select-all">
              {comp.complaintId}
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold">
              Filed on: {new Date(comp.createdAt).toLocaleDateString('en-US', {
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
            <Badge variant={comp.status === 'resolved' || comp.status === 'closed' ? 'success' : 'warning'}>
              {statusLabels[comp.status] || comp.status}
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
                  const isCompleted = idx <= compStatusIndex;
                  const isActive = idx === compStatusIndex;
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
                  <span className="text-gray-900 dark:text-white">{comp.category}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold border-b border-gray-100 dark:border-gray-850 pb-2">
                  <span className="text-gray-500">Assigned Department:</span>
                  <span className="text-primary dark:text-accent">{comp.assignedTo}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-gray-500">Location:</span>
                  <span className="text-gray-900 dark:text-white">{comp.area}, {comp.city} ({comp.district})</span>
                </div>
              </div>
              <div className="pt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 font-semibold space-y-1.5">
                <span className="block font-black text-gray-800 dark:text-white">Issue Description:</span>
                <p className="bg-gray-50 dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">{comp.description}</p>
              </div>

              {/* Evidence photos */}
              {comp.images && comp.images.length > 0 && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h5 className="text-xs font-black text-gray-800 dark:text-white mb-3">Attached Evidence</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {comp.images.map((url: string, index: number) => (
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
            {comp.coordinates && (comp.coordinates.lat || comp.coordinates.lng) && (
              <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Report Location Map</h4>
                <div className="h-[200px] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <SafeMap
                    markers={[
                      {
                        id: comp._id,
                        lat: comp.coordinates.lat,
                        lng: comp.coordinates.lng,
                        title: comp.category,
                        description: `${comp.area}, ${comp.city}`,
                        color: '#e11d48',
                      },
                    ]}
                    center={[comp.coordinates.lat, comp.coordinates.lng]}
                    zoom={12}
                  />
                </div>
              </div>
            )}

            {/* Action logs history */}
            <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Departmental Logs</h4>
              {comp.notes && comp.notes.length > 0 ? (
                <div className="space-y-4">
                  {comp.notes.map((note: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-primary/40 pl-3.5 space-y-1">
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">{note.text}</p>
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
    );
  };

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-12">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl w-1/3 mx-auto" />
        <div className="h-40 bg-gray-150 dark:bg-gray-800/40 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-60 bg-gray-150 dark:bg-gray-800/40 rounded-3xl md:col-span-2" />
          <div className="h-60 bg-gray-150 dark:bg-gray-800/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="space-y-12 max-w-4xl mx-auto">
        <div className="glass-premium border border-gray-200/80 dark:border-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent">
            <User className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Track Your Complaints</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              Sign in to view your personalized citizen dashboard, showing all your reported complaints, real-time status updates, and action timelines.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login?callbackUrl=/track"
              className="inline-flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 text-sm"
            >
              Sign In to Your Dashboard
              <ChevronRight className="h-4 w-4 text-secondary" />
            </Link>
          </div>
        </div>

        {/* Guest Search divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 dark:border-gray-850"></div>
          </div>
          <span className="relative bg-gray-50 dark:bg-gray-950 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Or Guest Tracking</span>
        </div>

        {/* Guest search input */}
        <div className="space-y-8">
          <Card variant="default" className="p-6 border-gray-200 dark:border-gray-800 max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Enter Tracking ID</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold">Enter your 5-digit complaint number (e.g., BAL-93210) to search anonymously.</p>
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

          {/* Guest results */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 rounded-2xl max-w-xl mx-auto text-xs font-bold text-center">
              {error}
            </div>
          )}

          {searched && !loading && complaint && renderComplaintDetails(complaint)}
        </div>
      </div>
    );
  }

  // Authenticated Dashboard Render
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Complaints list */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
            <h2 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Clipboard className="h-4 w-4 text-primary" />
              My Complaints
            </h2>
            <Badge variant="info" className="text-[10px] px-1.5 py-0.5">
              {userComplaints.length} Filed
            </Badge>
          </div>

          {loadingList ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-gray-100 dark:bg-gray-800/40 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : userComplaints.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <FileText className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-semibold">No complaints reported yet.</p>
              <Link
                href="/complaint"
                className="inline-flex items-center gap-1 text-xs text-primary dark:text-accent font-bold hover:underline"
              >
                File your first complaint
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {userComplaints.map((c) => {
                const isSelected = selectedId === c.complaintId;
                return (
                  <button
                    key={c.complaintId}
                    onClick={() => handleSelectComplaint(c)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:border-accent dark:bg-accent/5 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-extrabold text-xs text-gray-900 dark:text-white truncate max-w-[140px]">
                        {c.category}
                      </span>
                      <Badge variant={c.status === 'resolved' || c.status === 'closed' ? 'success' : 'warning'} className="text-[9px] px-1.5 py-0.5">
                        {statusLabels[c.status] || c.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold w-full">
                      <span>{c.complaintId}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick options */}
        <div className="flex gap-2">
          <Link
            href="/complaint"
            className="flex-grow flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-sm transition-all"
          >
            Report New Issue
          </Link>
          <button
            onClick={() => {
              const id = prompt('Enter Guest Tracking ID:');
              if (id) {
                router.replace(`/track?id=${id.toUpperCase().trim()}`);
                handleSearch(id);
              }
            }}
            className="px-4 py-2.5 text-xs font-bold rounded-2xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
          >
            Guest Search
          </button>
        </div>
      </div>

      {/* Right Column: Tracking Details */}
      <div className="lg:col-span-8">
        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        ) : complaint ? (
          renderComplaintDetails(complaint)
        ) : (
          <div className="bg-white/40 dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl p-16 text-center">
            <Clock className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-semibold">Select a complaint from the list to view its live status and history timeline.</p>
          </div>
        )}
      </div>
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
