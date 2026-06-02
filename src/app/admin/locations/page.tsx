'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Dialog from '@/components/ui/dialog';
import Badge from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, MapPin, Compass, Globe } from 'lucide-react';
import { getLocationsAction, createLocationAction, deleteLocationAction } from '@/app/actions';

interface LocationItem {
  _id: string;
  title: string;
  district: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  description: string;
  category: 'Natural Attraction' | 'Historical Place' | 'Cultural Heritage' | 'Coastal Point' | 'Other';
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Natural Attraction' | 'Historical Place' | 'Cultural Heritage' | 'Coastal Point' | 'Other'>('Natural Attraction');
  const [district, setDistrict] = useState('Quetta');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [attractions, setAttractions] = useState('');
  const [directions, setDirections] = useState('');
  const [nearby, setNearby] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await getLocationsAction();
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !district || !lat || !lng || !image || !description) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    setSubmitting(true);
    
    // Parse comma-separated fields
    const parsedAttractions = attractions.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedNearby = nearby.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      const res = await createLocationAction({
        title,
        category,
        district,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
        images: [image],
        description,
        attractions: parsedAttractions,
        directions,
        nearbyPlaces: parsedNearby,
      });

      if (res.success && res.data) {
        setLocations((prev) => [...prev, res.data].sort((a, b) => a.title.localeCompare(b.title)));
        setDialogOpen(false);
        setTitle('');
        setImage('');
        setLat('');
        setLng('');
        setDescription('');
        setAttractions('');
        setDirections('');
        setNearby('');
      } else {
        alert(res.error || 'Failed to publish location.');
      }
    } catch (err) {
      console.error(err);
      alert('Error publishing location.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const res = await deleteLocationAction(id);
      if (res.success) {
        setLocations((prev) => prev.filter((loc) => loc._id !== id));
      } else {
        alert(res.error || 'Failed to delete location.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting location.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Locations Showcase</h1>
          <p className="text-xs text-gray-500 mt-1">Manage natural attractions, heritage buildings, and coastal beaches.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="primary"
          className="text-xs font-bold flex items-center gap-1.5 rounded-xl py-2.5"
        >
          <Plus className="h-4.5 w-4.5 text-secondary" />
          Add Destination
        </Button>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-32 bg-gray-100 dark:bg-gray-855 rounded-2xl" />
          <div className="h-32 bg-gray-100 dark:bg-gray-855 rounded-2xl" />
        </div>
      )}

      {/* Listing Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.length > 0 ? (
            locations.map((loc) => (
              <Card key={loc._id} className="p-4 border-gray-150 dark:border-gray-800 flex gap-4 hover:shadow-md transition-shadow relative group">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  <img src={loc.images?.[0]} alt={loc.title} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{loc.category}</Badge>
                    <span className="text-[10px] text-gray-405 font-bold flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {loc.district}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">{loc.title}</h4>
                  <p className="text-[10px] text-gray-450 font-semibold leading-relaxed">
                    Lat: {loc.coordinates?.lat?.toFixed(3)} • Lng: {loc.coordinates?.lng?.toFixed(3)}
                  </p>
                </div>

                {/* Delete button absolute right corner */}
                <button
                  onClick={() => handleDelete(loc._id)}
                  className="absolute right-3 bottom-3 p-1.5 rounded-lg border border-red-150 hover:bg-red-50 text-red-500 dark:border-red-955/20 dark:hover:bg-red-955/10 transition-colors"
                  title="Delete location"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 font-semibold">
              <Compass className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <span>No destinations added yet.</span>
            </div>
          )}
        </div>
      )}

      {/* Creation Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Publish New Location Spot"
      >
        <form onSubmit={handleCreate} className="space-y-4 py-2">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Destination Name</label>
            <Input
              placeholder="e.g. Kund Malir Golden Beach"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="flex w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Natural Attraction" className="dark:bg-gray-900">Natural Attraction</option>
                <option value="Historical Place" className="dark:bg-gray-900">Historical Place</option>
                <option value="Cultural Heritage" className="dark:bg-gray-900">Cultural Heritage</option>
                <option value="Coastal Point" className="dark:bg-gray-900">Coastal Point</option>
                <option value="Other" className="dark:bg-gray-900">Other</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">District Location</label>
              <Input
                placeholder="e.g. Lasbela"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Latitude</label>
              <Input
                placeholder="e.g. 25.3941"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Longitude</label>
              <Input
                placeholder="e.g. 65.4593"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Images URL</label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Attractions (Comma separated)</label>
            <Input
              placeholder="e.g. Golden sand swims, Canyons, Coastal highway drive"
              value={attractions}
              onChange={(e) => setAttractions(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Nearby Places (Comma separated)</label>
            <Input
              placeholder="e.g. Hingol National Park, Nani Mandir Temple"
              value={nearby}
              onChange={(e) => setNearby(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Travel Directions</label>
            <Input
              placeholder="e.g. Take the Makran Coastal Highway from Karachi towards Gwadar..."
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Detailed Description</label>
            <Textarea
              placeholder="Provide a detailed description of the spot..."
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
              Publish Location
            </Button>
          </div>

        </form>
      </Dialog>

    </div>
  );
}
