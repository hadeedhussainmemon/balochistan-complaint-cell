'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Dialog from '@/components/ui/dialog';
import Badge from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Calendar, MapPin, Users, CalendarDays } from 'lucide-react';
import { getEventsAction, createEventAction, deleteEventAction } from '@/app/actions';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  registrations: any[];
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await getEventsAction();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !date || !image) return;

    setSubmitting(true);
    try {
      const res = await createEventAction({ title, description, location, date, image });
      if (res.success && res.data) {
        setEvents((prev) => [...prev, res.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setDialogOpen(false);
        setTitle('');
        setDescription('');
        setLocation('');
        setDate('');
        setImage('');
      } else {
        alert(res.error || 'Failed to create event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await deleteEventAction(id);
      if (res.success) {
        setEvents((prev) => prev.filter((evt) => evt._id !== id));
      } else {
        alert(res.error || 'Failed to delete event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting event.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Events Calendar</h1>
          <p className="text-xs text-gray-500 mt-1">Manage public cultural festivals, official expos, and community activities.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="primary"
          className="text-xs font-bold flex items-center gap-1.5 rounded-xl py-2.5"
        >
          <Plus className="h-4.5 w-4.5 text-secondary" />
          Add Event
        </Button>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        </div>
      )}

      {/* Listing Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.length > 0 ? (
            events.map((evt) => (
              <Card key={evt._id} className="p-4 border-gray-200 dark:border-gray-800 flex gap-4 hover:shadow-md transition-shadow relative group">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  <img src={evt.image} alt={evt.title} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1 flex-1 min-w-0 pr-8">
                  <span className="text-[9px] font-black uppercase text-secondary tracking-wider">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">{evt.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{evt.location}</span>
                  </p>
                  <p className="text-[10px] text-primary dark:text-accent font-bold flex items-center gap-1 pt-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{evt.registrations?.length || 0} Registered Attendee(s)</span>
                  </p>
                </div>

                {/* Delete button absolute right corner */}
                <button
                  onClick={() => handleDelete(evt._id)}
                  className="absolute right-3 bottom-3 p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 dark:border-red-950/20 dark:hover:bg-red-950/10 transition-colors"
                  title="Delete event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 font-semibold">
              <CalendarDays className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <span>No events scheduled yet.</span>
            </div>
          )}
        </div>
      )}

      {/* Creation Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Schedule New Event"
      >
        <form onSubmit={handleCreate} className="space-y-4 py-2">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Event Title</label>
            <Input
              placeholder="e.g. Ziarat Cherry Blossom Mela"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Image URL</label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Location Venue</label>
            <Input
              placeholder="e.g. Prospect Point, Ziarat Valley"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Event Description</label>
            <Textarea
              placeholder="Provide a detailed agenda or itinerary for the event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              onClick={() => setDialogOpen(false)}
              variant="outline"
              className="flex-1 text-xs py-2.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              variant="primary"
              className="flex-1 text-xs py-2.5"
            >
              Schedule Event
            </Button>
          </div>

        </form>
      </Dialog>

    </div>
  );
}
