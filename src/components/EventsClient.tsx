'use client';

import React, { useState } from 'react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Dialog from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, MapPin, Users, Ticket, Check } from 'lucide-react';
import { registerForEventAction } from '@/app/actions';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  registrations: any[];
}

interface EventsClientProps {
  initialEvents: EventItem[];
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  
  // Registration Form State
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleOpenDialog = (evt: EventItem) => {
    setSelectedEvent(evt);
    setName('');
    setEmail('');
    setPhone('');
    setError('');
    setSuccess(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!name || !email || !phone) {
      setError('Please fill in all the details.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await registerForEventAction(selectedEvent._id, { name, email, phone });
      if (res.success && res.data) {
        setSuccess(true);
        // Update local list
        setEvents((prev) =>
          prev.map((e) => (e._id === selectedEvent._id ? res.data : e))
        );
      } else {
        setError(res.error || 'Failed to register. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((evt) => {
          const dateObj = new Date(evt.date);
          return (
            <Card
              key={evt._id}
              className="group overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full"
            >
              {/* Event Image & Floating Calendar Style */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                
                {/* Calendar box */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 shadow-md px-3.5 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center select-none">
                  <span className="text-[10px] font-black uppercase text-primary leading-none tracking-wider">
                    {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-black text-gray-900 dark:text-white leading-none mt-1.5">
                    {dateObj.toLocaleDateString('en-US', { day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Header */}
              <CardHeader className="p-5 flex-1 pb-2">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold mb-2">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </div>
                <CardTitle className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                  {evt.title}
                </CardTitle>
              </CardHeader>

              {/* Content */}
              <CardContent className="px-5 pt-0 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 font-medium">
                  {evt.description}
                </p>
                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                  <Users className="h-4.5 w-4.5 text-primary" />
                  <span>{evt.registrations?.length || 0} Registered Attendees</span>
                </div>
              </CardContent>

              {/* Action */}
              <CardFooter className="px-5 pb-5 pt-0 border-t-0 mt-auto">
                <Button
                  onClick={() => handleOpenDialog(evt)}
                  variant="primary"
                  className="w-full text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl py-2.5"
                >
                  <Ticket className="h-4 w-4 text-secondary" />
                  Register to Attend
                </Button>
              </CardFooter>

            </Card>
          );
        })}
      </div>

      {/* Registration Dialog Form */}
      <Dialog
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title="Event Registration"
      >
        {selectedEvent && (
          <div className="space-y-4 py-2">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">{selectedEvent.title}</h4>
              <p className="text-[11px] text-gray-500 font-medium mt-1">
                {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">{selectedEvent.location}</p>
            </div>

            {success ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Registration Successful!</h3>
                <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto">
                  Your seat has been reserved. We have registered your details for {selectedEvent.title}.
                </p>
                <div className="pt-2">
                  <Button onClick={() => setSelectedEvent(null)} variant="outline" className="text-xs py-2">
                    Close Window
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-100 dark:border-red-900/50">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Full Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
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

                <div className="pt-2 flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    variant="outline"
                    className="flex-1 text-xs py-2.5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={loading}
                    variant="primary"
                    className="flex-1 text-xs py-2.5"
                  >
                    Confirm Registration
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </Dialog>

    </div>
  );
}
