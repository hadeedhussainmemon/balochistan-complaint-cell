import React from 'react';
import Link from 'next/link';
import { Landmark, Phone, Mail, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 border-t border-gray-800 pt-16 pb-8 transition-colors duration-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/20">
                <Landmark className="h-4.5 w-4.5 text-secondary" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Balochistan<span className="text-secondary font-medium">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Bridging the gap between the Government of Balochistan and its citizens. Digitalizing civic services, promoting regional locations, and ensuring transparency.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Civic Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/complaint" className="hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1">
                  File a Complaint
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary dark:hover:text-accent transition-colors">
                  Helpline Directory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary dark:hover:text-accent transition-colors">
                  Platform Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Events */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/locations" className="hover:text-primary dark:hover:text-accent transition-colors">
                  Explore Locations
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary dark:hover:text-accent transition-colors">
                  Upcoming Cultural Events
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary dark:hover:text-accent transition-colors">
                  Government Announcements
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-primary dark:hover:text-accent transition-colors">
                  Administration Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">IT Department HQ</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span>Balochistan Civil Secretariat, Zarghoon Road, Quetta, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span>+92 (81) 920-1111 (Complaints Helpline)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span>support@balochistan.gov.pk</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Balochistan Connect. Developed by IT Department, Government of Balochistan.
          </div>
          <div className="flex gap-4">
            <a href="https://balochistan.gov.pk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors flex items-center gap-1">
              Official Government Portal <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-gray-700">|</span>
            <Link href="/login" className="hover:text-gray-300 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
