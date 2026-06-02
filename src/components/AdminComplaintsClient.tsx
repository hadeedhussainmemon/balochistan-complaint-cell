'use client';

import React, { useState, useMemo } from 'react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Dialog from '@/components/ui/dialog';
import Textarea from '@/components/ui/textarea';
import SafeMap from '@/components/DynamicMap';
import { updateComplaintStatusAction } from '@/app/actions';
import { Search, Eye, Filter, CheckCircle2, User, Phone, MapPin, AlertCircle, FileText, ClipboardList } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ComplaintItem {
  _id: string;
  complaintId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  district: string;
  city: string;
  area: string;
  images: string[];
  status: string;
  assignedTo: string;
  notes: any[];
  coordinates?: { lat: number; lng: number };
  createdAt: string;
}

interface AdminComplaintsClientProps {
  initialComplaints: ComplaintItem[];
}

const statusFilters = ['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const priorityFilters = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const departments = [
  'Quetta Electric Supply Company (QESCO)',
  'Quetta Metropolitan Corporation (QMC)',
  'Gwadar Development Authority (GDA)',
  'Public Health Engineering (PHE) Balochistan',
  'Sui Southern Gas Company (SSGC)',
  'Communication & Works Department (C&W)',
  'Balochistan Waste Management',
  'Civil Defence & Public Safety',
];

export default function AdminComplaintsClient({ initialComplaints }: AdminComplaintsClientProps) {
  const { data: session } = useSession();
  const adminName = session?.user?.name || 'Admin Officer';

  const [complaints, setComplaints] = useState<ComplaintItem[]>(initialComplaints);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [activePriority, setActivePriority] = useState('ALL');

  // Action states for selected complaint
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editAssigned, setEditAssigned] = useState('');
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filters logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch = 
        c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = activeStatus === 'ALL' || c.status.toLowerCase() === activeStatus.toLowerCase();
      const matchesPriority = activePriority === 'ALL' || c.priority.toLowerCase() === activePriority.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, activeStatus, activePriority]);

  const handleOpenDetails = (c: ComplaintItem) => {
    setSelectedComplaint(c);
    setEditStatus(c.status);
    setEditAssigned(c.assignedTo || 'Unassigned');
    setNewNote('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdating(true);
    try {
      const res = await updateComplaintStatusAction(selectedComplaint.complaintId, {
        status: editStatus as any,
        assignedTo: editAssigned,
        noteText: newNote.trim() ? newNote.trim() : undefined,
        noteAuthor: newNote.trim() ? adminName : undefined,
      });

      if (res.success && res.data) {
        // Update local state list
        setComplaints((prev) =>
          prev.map((c) => (c.complaintId === selectedComplaint.complaintId ? res.data : c))
        );
        setSelectedComplaint(res.data);
        setNewNote('');
        alert('Complaint updated successfully!');
      } else {
        alert(res.error || 'Failed to update ticket.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating complaint.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search and filter header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Input
            placeholder="Search ID, citizen or issue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-white dark:bg-gray-900"
          />
          <div className="absolute left-3.5 top-3.5 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        </div>

        {/* Status filter */}
        <div className="md:col-span-4 flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-gray-455">Status:</span>
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            className="bg-transparent border-0 focus:ring-0 focus:outline-none font-bold"
          >
            {statusFilters.map((s) => (
              <option key={s} value={s} className="dark:bg-gray-900">{s}</option>
            ))}
          </select>
        </div>

        {/* Priority filter */}
        <div className="md:col-span-4 flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-gray-455">Priority:</span>
          <select
            value={activePriority}
            onChange={(e) => setActivePriority(e.target.value)}
            className="bg-transparent border-0 focus:ring-0 focus:outline-none font-bold"
          >
            {priorityFilters.map((p) => (
              <option key={p} value={p} className="dark:bg-gray-900">{p}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid listing table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-left text-xs font-bold text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/40 text-gray-500 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-4">Complaint ID</th>
              <th className="px-5 py-4">Citizen</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">District</th>
              <th className="px-5 py-4">Severity</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-5 py-4 select-all">{c.complaintId}</td>
                  <td className="px-5 py-4 font-semibold">
                    <p className="text-gray-900 dark:text-gray-100 leading-tight">{c.name}</p>
                    <span className="text-[10px] text-gray-400 font-semibold">{c.phone}</span>
                  </td>
                  <td className="px-5 py-4 font-semibold">{c.category}</td>
                  <td className="px-5 py-4 font-semibold">{c.district}</td>
                  <td className="px-5 py-4">
                    <Badge variant={c.priority === 'urgent' || c.priority === 'high' ? 'danger' : 'warning'}>
                      {c.priority}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${
                      c.status === 'resolved' ? 'bg-green-500'
                        : c.status === 'in_progress' ? 'bg-blue-500'
                        : c.status === 'under_review' ? 'bg-yellow-500'
                        : c.status === 'assigned' ? 'bg-purple-500'
                        : 'bg-gray-400'
                    }`} />
                    <span className="capitalize">{statusLabels[c.status]}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      onClick={() => handleOpenDetails(c)}
                      variant="outline"
                      className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg flex items-center gap-1.5 ml-auto"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Manage
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500 font-semibold">
                  No complaints found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* detailed action panel Dialog */}
      <Dialog
        isOpen={selectedComplaint !== null}
        onClose={() => setSelectedComplaint(null)}
        title="Manage Complaint Ticket"
      >
        {selectedComplaint && (
          <form onSubmit={handleUpdate} className="space-y-4 py-2">
            
            {/* Overview Box */}
            <div className="p-3 bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">Tracking Number:</span>
                <span className="text-gray-900 dark:text-white select-all">{selectedComplaint.complaintId}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">Submitter:</span>
                <span className="text-gray-900 dark:text-white flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-primary shrink-0" />
                  {selectedComplaint.name} ({selectedComplaint.phone})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">Address:</span>
                <span className="text-gray-900 dark:text-white flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  {selectedComplaint.area}, {selectedComplaint.city}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs space-y-1">
              <span className="text-gray-500 font-bold">Issue Description:</span>
              <p className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 leading-relaxed font-semibold text-gray-700 dark:text-gray-300">
                {selectedComplaint.description}
              </p>
            </div>

            {/* Evidence List */}
            {selectedComplaint.images && selectedComplaint.images.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-500">Uploaded Evidence:</span>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {selectedComplaint.images.map((img, idx) => (
                    <a href={img} target="_blank" rel="noopener noreferrer" key={idx} className="block relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100">
                      <img src={img} alt="Evidence" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Form Updates Controls */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
              
              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Update Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="flex w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {Object.keys(statusLabels).map((key) => (
                    <option key={key} value={key} className="dark:bg-gray-900">
                      {statusLabels[key]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Assign Authority</label>
                <select
                  value={editAssigned}
                  onChange={(e) => setEditAssigned(e.target.value)}
                  className="flex w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Unassigned" className="dark:bg-gray-900">Unassigned</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="dark:bg-gray-900">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Note logs list */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-500">Operation Log Notes</span>
              
              {/* List of existing notes */}
              {selectedComplaint.notes && selectedComplaint.notes.length > 0 && (
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {selectedComplaint.notes.map((n, idx) => (
                    <div key={idx} className="p-2 border-l-2 border-primary bg-gray-50 dark:bg-gray-800 rounded-r-xl text-[10px] font-semibold leading-relaxed">
                      <p className="text-gray-700 dark:text-gray-300">{n.text}</p>
                      <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                        <span>Officer: {n.author}</span>
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add note input */}
              <Textarea
                placeholder="Type internal dispatcher updates (e.g. dispatched repair crew, grid offline)..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Submit changes */}
            <div className="pt-2 flex gap-3">
              <Button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                variant="outline"
                className="flex-1 text-xs py-2.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={updating}
                variant="primary"
                className="flex-1 text-xs py-2.5"
              >
                Save Updates
              </Button>
            </div>

          </form>
        )}
      </Dialog>

    </div>
  );
}
