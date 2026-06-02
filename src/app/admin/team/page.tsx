'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Dialog from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, User, Mail, ShieldAlert } from 'lucide-react';
import { getTeamAction, createTeamMemberAction, deleteTeamMemberAction } from '@/app/actions';

interface TeamItem {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
    facebook?: string;
  };
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const res = await getTeamAction();
      if (res.success && res.data) {
        setTeam(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !image) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createTeamMemberAction({
        name,
        role,
        image,
        bio,
        socials: {
          twitter,
          linkedin,
          email,
          facebook,
        },
      });

      if (res.success && res.data) {
        setTeam((prev) => [...prev, res.data]);
        setDialogOpen(false);
        setName('');
        setRole('');
        setImage('');
        setBio('');
        setTwitter('');
        setLinkedin('');
        setEmail('');
        setFacebook('');
      } else {
        alert(res.error || 'Failed to add team member.');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding team member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const res = await deleteTeamMemberAction(id);
      if (res.success) {
        setTeam((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(res.error || 'Failed to delete team member.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting team member.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Administration Directory</h1>
          <p className="text-xs text-gray-500 mt-1">Manage public profiles for department directors, patrons, and administrators.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="primary"
          className="text-xs font-bold flex items-center gap-1.5 rounded-xl py-2.5"
        >
          <Plus className="h-4.5 w-4.5 text-secondary" />
          Add Officer
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
          {team.length > 0 ? (
            team.map((member) => (
              <Card key={member._id} className="p-4 border-gray-200 dark:border-gray-800 flex gap-4 hover:shadow-md transition-shadow relative group">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1 flex-1 min-w-0 pr-8">
                  <span className="text-[9px] font-black uppercase text-secondary tracking-widest">
                    {member.role}
                  </span>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">{member.name}</h4>
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed font-semibold">{member.bio || 'Public office profile.'}</p>
                </div>

                {/* Delete button absolute right corner */}
                <button
                  onClick={() => handleDelete(member._id)}
                  className="absolute right-3 bottom-3 p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 dark:border-red-950/20 dark:hover:bg-red-950/10 transition-colors"
                  title="Remove officer profile"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 font-semibold">
              <User className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <span>No administrative profiles registered yet.</span>
            </div>
          )}
        </div>
      )}

      {/* Creation Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Register Executive Officer"
      >
        <form onSubmit={handleCreate} className="space-y-4 py-2">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Officer Name</label>
              <Input
                placeholder="e.g. Hammad Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Position / Designation</label>
              <Input
                placeholder="e.g. Director General IT"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Profile Photo URL</label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Official Email</label>
              <Input
                type="email"
                placeholder="e.g. hammad@balochistan.gov.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Twitter Link</label>
              <Input
                placeholder="https://twitter.com/..."
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">LinkedIn Link</label>
              <Input
                placeholder="https://linkedin.com/in/..."
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Facebook Link</label>
              <Input
                placeholder="https://facebook.com/..."
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-655 dark:text-gray-400">Officer Biography</label>
            <Textarea
              placeholder="Short bio regarding responsibilities or department overview..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
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
              Register Officer
            </Button>
          </div>

        </form>
      </Dialog>

    </div>
  );
}
