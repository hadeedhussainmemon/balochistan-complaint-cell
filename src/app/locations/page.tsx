import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationsClient from '@/components/LocationsClient';
import * as dbService from '@/lib/dbService';

export const revalidate = 60; // ISR

export const metadata = {
  title: 'Explore Locations | Balochistan Connect',
  description: 'Discover historical landmarks, scenic valleys, desert canyons, and untouched beaches like Kund Malir and Astola Island in Balochistan.',
};

export default async function LocationsPage() {
  const locations = await dbService.getLocations();

  // Convert mongoose models to JSON-serializable structures
  const serializedLocations = JSON.parse(JSON.stringify(locations));

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
              Balochistan Locations
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-none">
              Explore Beautiful Locations
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto font-medium">
              Discover beautiful spots, scenic landscapes, and historic remnants of Pakistans largest province.
            </p>
          </div>

          {/* Interactive Search, Map & Cards client */}
          <LocationsClient initialLocations={serializedLocations} />

        </div>
      </main>

      <Footer />
    </>
  );
}
