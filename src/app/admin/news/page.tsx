'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Badge from '@/components/ui/badge';
import Dialog from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Calendar, Newspaper, Image as ImageIcon } from 'lucide-react';
import { getNewsAction, createNewsAction, deleteNewsAction } from '@/app/actions';

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  category: 'Announcement' | 'Press Release' | 'Development' | 'Community' | 'Tourism';
  image: string;
  content: string;
  publishedAt: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Announcement' | 'Press Release' | 'Development' | 'Community' | 'Tourism'>('Announcement');
  const [image, setImage] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const res = await getNewsAction();
      if (res.success && res.data) {
        setNews(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !image) return;

    setSubmitting(true);
    try {
      const res = await createNewsAction({ title, content, category, image });
      if (res.success && res.data) {
        setNews((prev) => [res.data, ...prev]);
        setDialogOpen(false);
        setTitle('');
        setContent('');
        setImage('');
        setCategory('Announcement');
      } else {
        alert(res.error || 'Failed to create announcement.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await deleteNewsAction(id);
      if (res.success) {
        setNews((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(res.error || 'Failed to delete article.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting article.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-xs text-gray-500 mt-1">Publish news updates, press releases, and development announcements.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="primary"
          className="text-xs font-bold flex items-center gap-1.5 rounded-xl py-2.5"
        >
          <Plus className="h-4.5 w-4.5 text-secondary" />
          Add Announcement
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
          {news.length > 0 ? (
            news.map((item) => (
              <Card key={item._id} className="p-4 border-gray-200 dark:border-gray-800 flex gap-4 hover:shadow-md transition-shadow relative group">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{item.category}</Badge>
                    <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-semibold">{item.content}</p>
                </div>

                {/* Delete button absolute right corner */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute right-3 bottom-3 p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 dark:border-red-950/20 dark:hover:bg-red-950/10 transition-colors"
                  title="Delete announcement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 font-semibold">
              <Newspaper className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <span>No news published yet.</span>
            </div>
          )}
        </div>
      )}

      {/* Creation Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add New Announcement"
      >
        <form onSubmit={handleCreate} className="space-y-4 py-2">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-650 dark:text-gray-400">Title</label>
            <Input
              placeholder="e.g. Clean drinking water plants installed"
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
                <option value="Announcement" className="dark:bg-gray-900">Announcement</option>
                <option value="Press Release" className="dark:bg-gray-900">Press Release</option>
                <option value="Development" className="dark:bg-gray-900">Development</option>
                <option value="Community" className="dark:bg-gray-900">Community</option>
                <option value="Tourism" className="dark:bg-gray-900">Tourism</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Image URL</label>
              <div className="relative">
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
                <div className="absolute right-3.5 top-3.5 text-gray-400">
                  <ImageIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Content</label>
            <Textarea
              placeholder="Provide full description of the announcement..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
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
              Publish News
            </Button>
          </div>

        </form>
      </Dialog>

    </div>
  );
}
