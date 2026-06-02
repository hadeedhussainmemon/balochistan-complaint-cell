'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import SafeMap from '@/components/DynamicMap';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Send, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setLoading(true);

    // Simulate sending email/message
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  // IT Secretariats coordinates (Zarghoon Road, Quetta)
  const mapCenter: [number, number] = [30.1968, 67.0145];
  const mapMarkers = [
    {
      id: 'sec-1',
      lat: 30.1968,
      lng: 67.0145,
      title: 'IT Secretariat Balochistan',
      description: 'Zarghoon Road, Quetta. Main Operations Center.',
      color: '#0f766e',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-none">
              Contact & Helpline Directory
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto font-medium">
              Submit feedback, contact technical support, or view district municipal directories.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Details & Helplines (Col 4) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Helplines Card */}
              <Card variant="default" className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Emergency Helplines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 text-red-650 shrink-0">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-300">Provincial Disaster Management (PDMA)</p>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">Helpline: 1600 (Toll-Free)</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-300">Civic Services Hub</p>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">Phone: +92 (81) 920-1111</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Direct Info Card */}
              <Card variant="default" className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-300">Address</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold mt-0.5">
                        IT Department, Zarghoon Road, Civil Secretariat, Quetta, Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-300">Email Support</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">support@balochistan.gov.pk</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Card */}
              <Card variant="default" className="p-2 border-gray-200 dark:border-gray-800">
                <div className="h-[250px] rounded-xl overflow-hidden">
                  <SafeMap markers={mapMarkers} center={mapCenter} zoom={13} />
                </div>
              </Card>

            </div>

            {/* Message Form (Col 7) */}
            <div className="lg:col-span-7">
              <Card variant="default" className="border-gray-200 dark:border-gray-800 p-2 sm:p-6 shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                
                {success ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent Successfully!</h3>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto font-semibold">
                      Thank you for contacting us. Our operations team will review your ticket and respond to your email shortly.
                    </p>
                    <div className="pt-4">
                      <Button onClick={() => setSuccess(false)} variant="outline" className="text-xs font-bold">
                        Send Another Message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Submit a Inquiry</h3>
                      <p className="text-xs text-gray-500 font-medium">Use the form below to send direct queries to the administrative helpdesk.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Full Name</label>
                        <Input
                          placeholder="Your name"
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
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Subject</label>
                      <Input
                        placeholder="What is this regarding?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Message Content</label>
                      <Textarea
                        placeholder="Describe your question or feedback..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      isLoading={loading}
                      variant="primary"
                      className="w-full sm:w-auto text-xs py-3 font-extrabold flex items-center justify-center gap-1.5"
                    >
                      <Send className="h-4 w-4 text-secondary" />
                      Send Message
                    </Button>
                  </form>
                )}

              </Card>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
