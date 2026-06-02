import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import * as dbService from '@/lib/dbService';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await dbService.getNewsBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | Balochistan Connect',
    };
  }

  const imageUrl = article.image || "/og-image.png";

  return {
    title: `${article.title} | Balochistan Connect`,
    description: article.content.substring(0, 160),
    openGraph: {
      title: `${article.title} | Balochistan Connect`,
      description: article.content.substring(0, 160),
      images: [
        {
          url: imageUrl,
          alt: article.title,
        }
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Balochistan Connect`,
      description: article.content.substring(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await dbService.getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 bg-transparent transition-colors duration-300">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back button */}
          <div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary dark:hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News Feed
            </Link>
          </div>

          {/* Article Header block */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">
                {article.category}
              </Badge>
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
                <User className="h-3.5 w-3.5" />
                PR Department
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Featured Image */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            
            {/* Sidebar actions */}
            <div className="md:col-span-3 space-y-6 md:sticky md:top-24 h-fit border-b md:border-b-0 md:border-r border-gray-300/20 dark:border-gray-800 pb-6 md:pb-0 md:pr-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <Tag className="h-4 w-4 text-primary shrink-0" />
                  {article.category}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Share</h4>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main content body */}
            <div className="md:col-span-9">
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 leading-relaxed text-base font-medium">
                {article.content.split('\n').map((paragraph: string, idx: number) => {
                  if (!paragraph.trim()) return null;
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
