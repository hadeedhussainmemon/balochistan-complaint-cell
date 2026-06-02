'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList, Map, ShieldAlert, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent pt-12 pb-20 md:pt-20 md:pb-32">
      
      {/* Decorative Floating Blurs */}
      <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/10 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-secondary/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          
          {/* Hero Texts */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            
            {/* Live Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent border border-primary/20 dark:border-accent/20 shadow-sm"
            >
              <Sparkles className="h-3 w-3 text-secondary animate-spin" />
              <span>Balochistan Connect Citizen Portal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white"
            >
              Connecting Citizens with{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Better Public Services
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Report daily civic issues like water, power, sewerage, and road damage. Explore the majestic landscapes of Pakistan’s largest province, and stay informed on official announcements.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/complaint"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                <ClipboardList className="h-5 w-5 text-secondary" />
                Submit Complaint
                <ArrowRight className="h-4.5 w-4.5 text-secondary" />
              </Link>
              
              <Link
                href="/locations"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <Map className="h-5 w-5 text-primary" />
                Explore Locations
              </Link>
            </motion.div>
            
            {/* Quick stats mini-bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-800 max-w-md mx-auto lg:mx-0 text-left"
            >
              <div>
                <p className="text-2xl font-black text-primary dark:text-accent">98.4%</p>
                <p className="text-xs text-gray-500 font-semibold">Resolution Rate</p>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">24/7</p>
                <p className="text-xs text-gray-500 font-semibold">Active Dispatch</p>
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">37</p>
                <p className="text-xs text-gray-500 font-semibold">Districts Tracked</p>
              </div>
            </motion.div>

          </div>

          {/* Hero Animated Balochistan Graphic */}
          <div className="lg:col-span-5 flex justify-center items-center relative z-0">
            
            {/* Floating Glow Orb Behind Map */}
            <div className="absolute h-80 w-80 bg-primary/20 rounded-full blur-3xl animate-float"></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[420px] aspect-square flex items-center justify-center bg-white/30 dark:bg-gray-900/30 border border-white/40 dark:border-gray-800/40 rounded-3xl backdrop-blur-md shadow-2xl p-6 overflow-hidden"
            >
              
              {/* Floating Grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

              {/* Styled SVG map overlay grid of Balochistan */}
              <svg
                viewBox="0 0 100 100"
                className="w-4/5 h-4/5 text-primary dark:text-accent/60 opacity-80 filter drop-shadow-[0_10px_15px_rgba(15,118,110,0.3)] animate-float"
              >
                {/* Triangular-Wedge abstraction of Balochistan Province map outline */}
                <path
                  d="M 15 65 L 45 10 L 85 40 L 68 85 L 35 90 L 15 65 Z"
                  fill="url(#emeraldGradient)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="2"
                  className="stroke-primary dark:stroke-accent"
                />
                
                {/* Gwadar Marker */}
                <circle cx="20" cy="68" r="3" fill="#D4A017" className="animate-ping" />
                <circle cx="20" cy="68" r="2" fill="#D4A017" />
                <text x="25" y="70" className="text-[3.5px] fill-gray-600 dark:fill-gray-300 font-bold">Gwadar</text>
                
                {/* Quetta Marker */}
                <circle cx="48" cy="22" r="3" fill="#38BDF8" className="animate-ping" />
                <circle cx="48" cy="22" r="2" fill="#38BDF8" />
                <text x="53" y="24" className="text-[3.5px] fill-gray-900 dark:fill-white font-black">QUETTA (HQ)</text>

                {/* Ziarat Marker */}
                <circle cx="58" cy="26" r="2.5" fill="#10B981" />
                <text x="63" y="28" className="text-[3.5px] fill-gray-600 dark:fill-gray-300 font-bold">Ziarat</text>

                {/* Khuzdar Marker */}
                <circle cx="44" cy="55" r="2.5" fill="#10B981" />
                <text x="49" y="57" className="text-[3.5px] fill-gray-600 dark:fill-gray-300 font-bold">Khuzdar</text>

                {/* Gradients */}
                <defs>
                  <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#d4a017" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Interface Card Floating inside hero */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-gray-800/40 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Transformer Failure</p>
                    <p className="text-[10px] text-gray-500 font-semibold">Khuzdar • In Progress</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                  Urgent
                </span>
              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
