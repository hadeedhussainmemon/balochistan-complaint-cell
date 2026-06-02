import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import * as dbService from '@/lib/dbService';
import { 
  ClipboardList, CheckCircle2, ChevronRight, MapPin, 
  Calendar, FileText, ArrowRight, ShieldCheck, HelpCircle, Clock 
} from 'lucide-react';

export const revalidate = 60; // Revalidate pages every minute (ISR)

export default async function HomePage() {
  // Fetch lists from database service layer (runs server-side)
  const locations = await dbService.getLocations();
  const news = await dbService.getNews();
  const events = await dbService.getEvents();

  // Slice featured items for preview
  const featuredLocations = locations.slice(0, 3);
  const featuredNews = news.slice(0, 3);
  const featuredEvents = events.slice(0, 2);

  const timelineSteps = [
    {
      step: '01',
      title: 'Submit Complaint',
      description: 'Fill out our modern multi-step form detailing the civic issue. Upload photo/video evidence and optionally pinpoint the GPS location.',
      icon: <ClipboardList className="h-6 w-6" />,
    },
    {
      step: '02',
      title: 'Complaint Review',
      description: 'Operations team reviews the complaint within hours, categorizing it, verifying the details, and updating its status to "Under Review".',
      icon: <HelpCircle className="h-6 w-6" />,
    },
    {
      step: '03',
      title: 'Assigned Authority',
      description: 'The complaint is automatically dispatched to the relevant department (e.g., QESCO for power outages, QMC for sewage problems) with custom logs.',
      icon: <ArrowRight className="h-6 w-6" />,
    },
    {
      step: '04',
      title: 'Resolution & Closure',
      description: 'Field technicians perform the maintenance, upload proof of repair, and mark the complaint resolved. Citizens track the progress at every milestone.',
      icon: <CheckCircle2 className="h-6 w-6" />,
    },
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Header */}
      <Hero />

      {/* Numerical Stats Counters */}
      <Stats />

      {/* Popular Tourism Locations */}
      <section className="py-20 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
                Discover Balochistan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                Featured Beautiful Locations
              </h2>
              <p className="text-sm text-gray-500 max-w-xl font-medium">
                Explore the natural wonders, historical landmarks, and golden beaches of Pakistans largest province.
              </p>
            </div>
            <Link
              href="/locations"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-accent hover:underline hover:gap-1.5 transition-all"
            >
              View All Locations
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLocations.map((loc: any) => (
              <Card 
                key={loc._id} 
                variant="default"
                className="group overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {/* Image with zoom effect */}
                  <img
                    src={loc.images?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'}
                    alt={loc.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">
                      {loc.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-5">
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{loc.district} District</span>
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors text-gray-900 dark:text-white">
                    {loc.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-3 leading-relaxed mt-2 text-gray-600 dark:text-gray-400">
                    {loc.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="px-5 pb-5 pt-0 border-t-0 flex items-center justify-between">
                  <Link 
                    href={`/locations/${loc._id}`}
                    className="w-full text-center py-2 text-xs font-bold text-primary dark:text-accent border border-primary/20 dark:border-accent/20 rounded-xl hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-gray-950 transition-colors"
                  >
                    Explore Destination
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works timeline */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 border-y border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
              Transparent Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              How the Service Works
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">
              We provide an open, transparent, and direct bridge between citizen reports and administrative offices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Horizontal Timeline Bar in Desktop */}
            <div className="hidden md:block absolute top-12 left-1/10 right-1/10 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-accent/20 z-0"></div>

            {timelineSteps.map((step, idx) => (
              <div 
                key={idx}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                {/* Icon wrapper with glow effect */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border-2 border-primary/30 dark:border-primary/50 text-primary dark:text-accent shadow-md shadow-primary/5 group-hover:scale-105 group-hover:border-primary transition-all duration-300">
                  {step.icon}
                </div>
                
                <span className="text-xs font-bold text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full mt-4">
                  Step {step.step}
                </span>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                  {step.title}
                </h3>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed px-2 font-medium">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic News & Upcoming Events Grid */}
      <section className="py-20 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Latest News (Col-Span 7) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
                    Government Updates
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
                    Latest Announcements & News
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="group inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-accent hover:underline hover:gap-1.5 transition-all"
                >
                  All News
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-6">
                {featuredNews.map((article: any) => (
                  <Link 
                    key={article._id}
                    href={`/news/${article.slug}`}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/40 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative w-full sm:w-40 aspect-video sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {article.category}
                        </Badge>
                        <span className="text-[10px] text-gray-500 font-bold">
                          {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold group-hover:text-primary dark:group-hover:text-accent transition-colors leading-tight text-gray-900 dark:text-white">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                        {article.content}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Events (Col-Span 5) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
                    Cultural Calendar
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
                    Upcoming Events
                  </h2>
                </div>
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-accent hover:underline hover:gap-1.5 transition-all"
                >
                  All Events
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-6">
                {featuredEvents.map((evt: any) => (
                  <Card 
                    key={evt._id}
                    className="overflow-hidden border border-gray-100 dark:border-gray-800/80 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="h-full w-full object-cover"
                      />
                      {/* Floating date badge */}
                      <div className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 shadow-md px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-primary leading-none">
                          {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black text-gray-950 dark:text-white leading-none mt-1">
                          {new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="p-5">
                      <CardTitle className="text-base font-extrabold text-gray-900 dark:text-white">
                        {evt.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold mt-2">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                        {evt.description}
                      </p>
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-accent hover:underline mt-3"
                      >
                        Register to Attend
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Citizen feedback carousel */}
      <Testimonials />

      {/* Action CTA Section */}
      <section className="py-20 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="glass-premium rounded-3xl p-8 md:p-16 text-center border-2 border-primary/20 dark:border-primary/40 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-accent/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-accent mb-2 border border-primary/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Submit and Track Your First Complaint Online
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Make your neighborhood a cleaner, safer, and better place. File reports in less than 5 minutes and track direct resolutions from official dispatch centers.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/complaint"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <ClipboardList className="h-5 w-5 text-secondary" />
                  File Complaint
                </Link>
                <Link
                  href="/track"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-800 shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Clock className="h-5 w-5 text-secondary" />
                  Track Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
