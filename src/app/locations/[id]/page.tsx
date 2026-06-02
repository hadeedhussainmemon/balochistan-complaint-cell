import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Badge from '@/components/ui/badge';
import SafeMap from '@/components/DynamicMap';
import * as dbService from '@/lib/dbService';
import { ArrowLeft, MapPin, Compass, Navigation, Landmark, Landmark as SiteIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface LocationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LocationDetailPageProps) {
  const { id } = await params;
  const loc = await dbService.getLocationById(id);
  
  if (!loc) {
    return {
      title: 'Location Not Found | Balochistan Connect',
    };
  }

  const imageUrl = loc.images && loc.images.length > 0 ? loc.images[0] : "/og-image.png";

  return {
    title: `${loc.title} - Location | Balochistan Connect`,
    description: loc.description.substring(0, 160),
    openGraph: {
      title: `${loc.title} - Location | Balochistan Connect`,
      description: loc.description.substring(0, 160),
      images: [
        {
          url: imageUrl,
          alt: loc.title,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${loc.title} - Location | Balochistan Connect`,
      description: loc.description.substring(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const { id } = await params;
  const loc = await dbService.getLocationById(id);

  if (!loc) {
    notFound();
  }

  // Convert mongoose model to standard JSON
  const serializedLoc = JSON.parse(JSON.stringify(loc));

  // Prepare marker for single location map
  const mapMarkers = [
    {
      id: serializedLoc._id,
      lat: serializedLoc.coordinates.lat,
      lng: serializedLoc.coordinates.lng,
      title: serializedLoc.title,
      description: `${serializedLoc.category} in ${serializedLoc.district}`,
      color: '#0f766e',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back button */}
          <div>
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary dark:hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Locations
            </Link>
          </div>

          {/* Title Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{serializedLoc.category}</Badge>
                <span className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {serializedLoc.district} District
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                {serializedLoc.title}
              </h1>
            </div>
          </div>

          {/* Images Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 bg-gray-200 dark:bg-gray-900">
              <img
                src={serializedLoc.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                alt={serializedLoc.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <div className="relative aspect-video md:aspect-auto md:h-[calc(50%-8px)] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 bg-gray-200 dark:bg-gray-900">
                <img
                  src={serializedLoc.images?.[1] || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21'}
                  alt={serializedLoc.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative aspect-video md:aspect-auto md:h-[calc(50%-8px)] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 bg-gray-200 dark:bg-gray-900 flex items-center justify-center text-center">
                <img
                  src={serializedLoc.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                  alt={serializedLoc.title}
                  className="h-full w-full object-cover opacity-30 filter blur-xs"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <Compass className="h-8 w-8 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-xs font-bold text-gray-900 dark:text-white mt-2">Balochistan Wilderness</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Description & Attractions (Col 8) */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-base font-medium">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About the Destination</h3>
                <p>{serializedLoc.description}</p>
              </div>

              {serializedLoc.attractions && serializedLoc.attractions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Key Features & Attractions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {serializedLoc.attractions.map((attr: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-accent shrink-0">
                          <span className="text-[10px] font-black">{index + 1}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{attr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {serializedLoc.directions && (
                <div className="space-y-3 p-6 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-secondary" />
                    How to Get There
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {serializedLoc.directions}
                  </p>
                </div>
              )}

            </div>

            {/* Map & Nearby attractions (Col 4) */}
            <div className="lg:col-span-4 space-y-6 md:sticky md:top-24">
              
              {/* Mini Map */}
              <div className="space-y-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Map Coordinates</h4>
                <div className="h-[220px] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <SafeMap
                    markers={mapMarkers}
                    center={[serializedLoc.coordinates.lat, serializedLoc.coordinates.lng]}
                    zoom={9}
                  />
                </div>
                <div className="text-[10px] font-semibold text-gray-400 text-center">
                  Latitude: {serializedLoc.coordinates.lat.toFixed(4)} • Longitude: {serializedLoc.coordinates.lng.toFixed(4)}
                </div>
              </div>

              {/* Nearby Places */}
              {serializedLoc.nearbyPlaces && serializedLoc.nearbyPlaces.length > 0 && (
                <div className="space-y-3 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nearby Places to Visit</h4>
                  <ul className="space-y-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {serializedLoc.nearbyPlaces.map((place: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <SiteIcon className="h-4 w-4 text-primary shrink-0" />
                        <span>{place}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
