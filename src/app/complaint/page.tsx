'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import TextareaInput from '@/components/ui/textarea';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { ClipboardList, User, MapPin, AlertTriangle, Image as ImageIcon, CheckCircle, ChevronRight, ChevronLeft, Paperclip, Trash2 } from 'lucide-react';
import { submitComplaintAction } from '@/app/actions';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const districts = [
  'Quetta', 'Gwadar', 'Ziarat', 'Khuzdar', 'Lasbela', 'Hub', 'Sibi', 'Loralai', 'Pishin', 
  'Jaffarabad', 'Zhob', 'Chaman', 'Mastung', 'Kech', 'Dera Bugti', 'Kohlu', 'Zhob', 'Kharan'
];

const categories = [
  'Water Supply',
  'Electricity Outage',
  'Gas Pipeline/Supply',
  'Sewerage & Drainage',
  'Road Damage',
  'Pipeline Leakage',
  'Street Lights',
  'Waste Management',
  'Public Safety',
  'Internet/Communication',
  'Other Civic Issues',
];

export default function ComplaintPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  
  // Step 1: Personal Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/complaint');
    } else if (session?.user && (session.user as any).role === 'admin') {
      router.push('/admin');
    }
  }, [status, router, session]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);
  
  // Step 2: Location
  const [district, setDistrict] = useState(districts[0]);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Step 3: Complaint details
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [description, setDescription] = useState('');

  // Step 4: Images & Submitting
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; complaintId?: string; error?: string } | null>(null);

  if (status === 'loading') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium dark:text-gray-400">Loading citizen profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const getGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGps({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsLoading(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        alert('Could not retrieve GPS coordinates. You can still submit without GPS.');
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [...imageUrls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          alert(`Failed to upload ${file.name}: ${data.error}`);
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Error uploading file.');
      }
    }

    setImageUrls(uploadedUrls);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 1 && (!name || !email || !phone)) {
      alert('Please fill out all personal details.');
      return;
    }
    if (step === 2 && (!district || !city || !area)) {
      alert('Please complete location details.');
      return;
    }
    if (step === 3 && (!category || !description)) {
      alert('Please select a category and provide a description of the issue.');
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const complaintData = {
      name,
      email,
      phone,
      category,
      priority,
      description,
      district,
      city,
      area,
      images: imageUrls,
      coordinates: gps || undefined,
      userId: (session?.user as any)?.id || undefined,
    };

    try {
      const res = await submitComplaintAction(complaintData);
      setSubmitResult(res);
      if (res.success) {
        setStep(5); // Show success screen
      }
    } catch (err: any) {
      setSubmitResult({ success: false, error: err.message || 'An error occurred during submission.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
              Citizen Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-none">
              Report a Civic Issue
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Complete the form below to register your complaint with district officers.
            </p>
          </div>

          {/* Stepper Progress bar */}
          {step <= 4 && (
            <div className="flex items-center justify-between mb-8 select-none">
              {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step === s
                          ? 'bg-primary text-white border-2 border-primary'
                          : step > s
                          ? 'bg-primary/20 text-primary border-2 border-primary/20'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {s}
                    </div>
                  </div>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors ${
                        step > s ? 'bg-primary/30' : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl">
            
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-primary shrink-0" />
                    Personal Information
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">We require contact details to link with status tracking and notifications.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Full Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Email Address</label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Phone Number</label>
                  <Input
                    placeholder="03xx-xxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location Selector */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    Geographic Details
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">Pinpoint the address to dispatch the correct regional municipality.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">District</label>
                  <div className="relative">
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="flex w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d} className="dark:bg-gray-900">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400">City / Tehsil</label>
                    <Input
                      placeholder="e.g. Quetta Cantt"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Area / Neighborhood</label>
                    <Input
                      placeholder="e.g. Samungli Road"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* GPS trigger */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-950 dark:text-white">Pinpoint Location via GPS</h4>
                      <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Attach your current coordinates to guide operations teams directly.</p>
                    </div>
                    <Button
                      type="button"
                      onClick={getGpsLocation}
                      isLoading={gpsLoading}
                      variant="outline"
                      className="text-xs flex items-center gap-1.5 py-2 rounded-xl"
                    >
                      <MapPin className="h-4 w-4" />
                      Get Coordinates
                    </Button>
                  </div>

                  {gps && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200/40 rounded-xl flex items-center justify-between text-xs text-green-700 dark:text-green-400 font-semibold">
                      <span>Coordinates Attached: {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}</span>
                      <button
                        type="button"
                        onClick={() => setGps(null)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Issue Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
                    Complaint Description
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">Categorize the issue and describe it clearly to help technical field agents.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="dark:bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Severity / Priority</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['low', 'medium', 'high', 'urgent'] as const).map((p) => {
                      const colors = {
                        low: 'hover:border-blue-400 peer-checked:bg-blue-500 peer-checked:text-white',
                        medium: 'hover:border-yellow-400 peer-checked:bg-yellow-500 peer-checked:text-white',
                        high: 'hover:border-orange-400 peer-checked:bg-orange-500 peer-checked:text-white',
                        urgent: 'hover:border-red-400 peer-checked:bg-red-500 peer-checked:text-white',
                      };
                      return (
                        <label key={p} className="cursor-pointer select-none">
                          <input
                            type="radio"
                            name="priority"
                            value={p}
                            checked={priority === p}
                            onChange={() => setPriority(p)}
                            className="sr-only peer"
                          />
                          <div className={`p-2.5 text-center text-xs font-bold uppercase rounded-xl border border-gray-350 dark:border-gray-800 transition-all ${
                            priority === p
                              ? p === 'low' ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : p === 'medium' ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                                : p === 'high' ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                                : 'bg-red-600 border-red-600 text-white shadow-sm'
                              : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}>
                            {p}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Detailed Description</label>
                  <TextareaInput
                    placeholder="Provide details about the sewerage, gas pipeline damage or blackout..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Images & Review */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary shrink-0" />
                    Attach Evidence & Submit
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">Attach photographs of the damage to assist technical dispatch assessments.</p>
                </div>

                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-800 p-6 rounded-2xl text-center hover:border-primary transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    disabled={uploading}
                  />
                  <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {uploading ? 'Uploading Evidence...' : 'Click to Upload Images'}
                  </p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-1">Supports PNG, JPG (Max 5MB each)</p>
                </div>

                {/* Local Preview Grid */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                        <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                          title="Remove Image"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Short review summary */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl space-y-2 border border-gray-200 dark:border-gray-800">
                  <h4 className="text-xs font-black uppercase text-gray-400">Review Summary</h4>
                  <div className="grid grid-cols-2 text-xs font-semibold gap-y-1">
                    <span className="text-gray-500">Submitter:</span>
                    <span className="text-gray-900 dark:text-white truncate text-right">{name}</span>
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-900 dark:text-white truncate text-right">{area}, {city}</span>
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-900 dark:text-white truncate text-right">{category}</span>
                    <span className="text-gray-500">Severity:</span>
                    <span className="text-right">
                      <Badge variant={priority === 'urgent' || priority === 'high' ? 'danger' : 'warning'}>
                        {priority}
                      </Badge>
                    </span>
                  </div>
                </div>

                {submitResult && !submitResult.success && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 text-xs font-semibold">
                    Error submitting: {submitResult.error}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Success screen */}
            {step === 5 && submitResult?.success && (
              <div className="text-center py-8 space-y-6 animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-9 w-9" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Complaint Registered!</h2>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto font-medium">
                    Your complaint has been successfully registered. Operations managers will dispatch municipal teams.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl max-w-sm mx-auto border border-gray-200 dark:border-gray-800 space-y-1.5">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tracking Number</p>
                  <p className="text-2xl font-black text-primary dark:text-accent select-all">
                    {submitResult.complaintId}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">Keep this ID to track updates in the track status directory.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link
                    href={`/track?id=${submitResult.complaintId}`}
                    className="flex justify-center items-center gap-1.5 px-6 py-3 font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-colors text-xs"
                  >
                    Track Progress
                    <ChevronRight className="h-4 w-4 text-secondary" />
                  </Link>
                  <Link
                    href="/"
                    className="flex justify-center items-center px-6 py-3 font-semibold rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs text-gray-700 dark:text-gray-300"
                  >
                    Return Home
                  </Link>
                </div>
              </div>
            )}

            {/* Nav controls */}
            {step <= 4 && (
              <div className="flex gap-4 mt-8 border-t border-gray-100 dark:border-gray-800 pt-5">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrev}
                    variant="outline"
                    className="flex-1 text-xs py-3 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="primary"
                    className="flex-1 text-xs py-3 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 text-secondary" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    isLoading={loading}
                    variant="primary"
                    className="flex-1 text-xs py-3 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    Submit Complaint
                  </Button>
                )}
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
