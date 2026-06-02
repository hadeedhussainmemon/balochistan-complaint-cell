'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import SafeMap from '@/components/DynamicMap';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MapPin, Compass, Search, Grid, Map as MapIcon, ChevronRight } from 'lucide-react';

interface LocationItem {
  _id: string;
  title: string;
  district: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  description: string;
  category: string;
  attractions?: string[];
}

interface LocationsClientProps {
  initialLocations: LocationItem[];
}

const categories = ['All', 'Natural Attraction', 'Historical Place', 'Cultural Heritage', 'Coastal Point'];
const districts = ['All', 'Quetta', 'Ziarat', 'Gwadar', 'Lasbela'];

export default function LocationsClient({ initialLocations }: LocationsClientProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDistrict, setActiveDistrict] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter logic
  const filteredLocations = useMemo(() => {
    return initialLocations.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesDistrict = activeDistrict === 'All' || item.district.toLowerCase() === activeDistrict.toLowerCase();

      return matchesSearch && matchesCategory && matchesDistrict;
    });
  }, [initialLocations, search, activeCategory, activeDistrict]);

  // Convert filtered locations to map markers
  const mapMarkers = useMemo(() => {
    return filteredLocations.map((loc) => ({
      id: loc._id,
      lat: loc.coordinates.lat,
      lng: loc.coordinates.lng,
      title: loc.title,
      description: `${loc.category} • ${loc.district} District`,
      color: '#0f766e', // Emerald green pin for tourism spots
    }));
  }, [filteredLocations]);

  return (
    <div className="space-y-8">
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full lg:max-w-xs shrink-0">
          <Input
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
          <div className="absolute left-3.5 top-3.5 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        </div>

        {/* Category & District Filter Selectors */}
        <div className="flex flex-wrap gap-2 items-center justify-center lg:justify-end w-full overflow-x-auto py-1">
          
          {/* Category Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeCategory === cat
                    ? 'bg-white dark:bg-gray-900 text-primary dark:text-accent shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
            {categories.length > 3 && (
              <select
                value={categories.includes(activeCategory) && categories.indexOf(activeCategory) >= 3 ? activeCategory : 'More'}
                onChange={(e) => {
                  if (e.target.value !== 'More') setActiveCategory(e.target.value);
                }}
                className="bg-transparent border-0 text-xs font-bold px-2 py-1 focus:ring-0 text-gray-600 dark:text-gray-400 focus:outline-none"
              >
                <option value="More" disabled>More...</option>
                {categories.slice(3).map(c => (
                  <option key={c} value={c} className="dark:bg-gray-900">{c}</option>
                ))}
              </select>
            )}
          </div>

          {/* District selector dropdown */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300">
            <span className="text-gray-400 dark:text-gray-500 font-semibold">District:</span>
            <select
              value={activeDistrict}
              onChange={(e) => setActiveDistrict(e.target.value)}
              className="bg-transparent border-0 focus:ring-0 focus:outline-none font-bold"
            >
              {districts.map(d => (
                <option key={d} value={d} className="dark:bg-gray-900">{d}</option>
              ))}
            </select>
          </div>

          {/* Grid / Map View Mode Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-gray-900 text-primary dark:text-accent shadow-sm' : 'text-gray-500'
              }`}
              title="Show Grid"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-white dark:bg-gray-900 text-primary dark:text-accent shadow-sm' : 'text-gray-500'
              }`}
              title="Show Map"
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Map View Panel */}
      {viewMode === 'map' && (
        <div className="h-[450px] w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-2 shadow-sm">
          <SafeMap markers={mapMarkers} zoom={6} />
        </div>
      )}

      {/* Grid listing */}
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredLocations.map((loc) => (
            <Card
              key={loc._id}
              className="group overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                <img
                  src={loc.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                  alt={loc.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary">{loc.category}</Badge>
                </div>
              </div>

              <CardHeader className="p-5 flex-1 pb-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{loc.district} District</span>
                </div>
                <CardTitle className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {loc.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-3 leading-relaxed mt-2 text-gray-600 dark:text-gray-400 font-medium">
                  {loc.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="px-5 pb-5 pt-0 border-t-0 mt-auto">
                <Link
                  href={`/locations/${loc._id}`}
                  className="w-full text-center py-2.5 text-xs font-bold text-primary dark:text-accent border border-primary/20 dark:border-accent/20 rounded-xl hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-gray-950 transition-colors flex items-center justify-center gap-1"
                >
                  Explore Destination
                  <ChevronRight className="h-3.5 w-3.5 font-bold" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No destinations found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto font-medium">
            Try adjusting your search filters or choosing a different district.
          </p>
        </div>
      )}

    </div>
  );
}
