'use server';

import { revalidatePath } from 'next/cache';
import * as dbService from '@/lib/dbService';

// ==========================================
// SEEDING ON BOOTSTRAP
// ==========================================
// Run database seeding if database is connected
dbService.seedDatabase();

// ==========================================
// CITIZEN ACTIONS
// ==========================================

export async function submitComplaintAction(data: {
  name: string;
  email: string;
  phone: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  district: string;
  city: string;
  area: string;
  images?: string[];
  coordinates?: { lat: number; lng: number };
  userId?: string;
}) {
  try {
    if (!data.name || !data.email || !data.phone || !data.category || !data.description || !data.district || !data.city || !data.area) {
      return { success: false, error: 'All fields are required.' };
    }

    const complaint = await dbService.createComplaint(data);
    revalidatePath('/admin');
    revalidatePath('/admin/complaints');
    return { success: true, complaintId: complaint.complaintId, data: JSON.parse(JSON.stringify(complaint)) };
  } catch (error: any) {
    console.error('Error submitting complaint:', error);
    return { success: false, error: error.message || 'Submission failed.' };
  }
}

export async function getComplaintByTrackingIdAction(trackingId: string) {
  try {
    const trackingClean = trackingId.toUpperCase().trim();
    const complaint = await dbService.getComplaintById(trackingClean);
    if (!complaint) {
      return { success: false, error: 'Complaint not found.' };
    }
    return { success: true, data: JSON.parse(JSON.stringify(complaint)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to search tracking ID.' };
  }
}

export async function getComplaintsByUserAction(email: string, userId?: string) {
  try {
    if (!email) {
      return { success: false, error: 'Email is required.' };
    }
    const complaints = await dbService.getComplaintsByUser(email, userId);
    return { success: true, data: JSON.parse(JSON.stringify(complaints)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch user complaints.' };
  }
}

export async function changePasswordAction(email: string, currentPass: string, newPass: string) {
  try {
    if (!email || !currentPass || !newPass) {
      return { success: false, error: 'All fields are required.' };
    }
    await dbService.updateUserPassword(email, currentPass, newPass);
    return { success: true, message: 'Password updated successfully.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Password update failed.' };
  }
}

export async function registerForEventAction(eventId: string, regData: {
  name: string;
  email: string;
  phone: string;
}) {
  try {
    if (!regData.name || !regData.email || !regData.phone) {
      return { success: false, error: 'All registration details are required.' };
    }
    const updated = await dbService.registerForEvent(eventId, regData);
    revalidatePath('/events');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed.' };
  }
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

export async function updateComplaintStatusAction(
  complaintId: string,
  updates: {
    status?: 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    noteText?: string;
    noteAuthor?: string;
  }
) {
  try {
    const complaint = await dbService.getComplaintById(complaintId);
    if (!complaint) {
      return { success: false, error: 'Complaint not found.' };
    }

    const fieldsToUpdate: any = {};
    if (updates.status) fieldsToUpdate.status = updates.status;
    if (updates.assignedTo) fieldsToUpdate.assignedTo = updates.assignedTo;

    // Append notes if supplied
    if (updates.noteText && updates.noteAuthor) {
      const currentNotes = complaint.notes ? JSON.parse(JSON.stringify(complaint.notes)) : [];
      currentNotes.push({
        text: updates.noteText,
        author: updates.noteAuthor,
        createdAt: new Date(),
      });
      fieldsToUpdate.notes = currentNotes;
    }

    const updated = await dbService.updateComplaint(complaintId, fieldsToUpdate);
    revalidatePath('/admin');
    revalidatePath('/admin/complaints');
    revalidatePath(`/track/${complaintId}`);
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error('Error updating complaint:', error);
    return { success: false, error: error.message || 'Update failed.' };
  }
}

// NEWS CRUD
export async function createNewsAction(data: {
  title: string;
  content: string;
  category: 'Announcement' | 'Press Release' | 'Development' | 'Community' | 'Tourism';
  image: string;
}) {
  try {
    const item = await dbService.createNews(data);
    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNewsAction(id: string) {
  try {
    await dbService.deleteNews(id);
    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// EVENTS CRUD
export async function createEventAction(data: {
  title: string;
  description: string;
  location: string;
  date: string; // ISO string
  image: string;
}) {
  try {
    const item = await dbService.createEvent({
      ...data,
      date: new Date(data.date),
    });
    revalidatePath('/events');
    revalidatePath('/admin/events');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEventAction(id: string) {
  try {
    await dbService.deleteEvent(id);
    revalidatePath('/events');
    revalidatePath('/admin/events');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// LOCATIONS CRUD
export async function createLocationAction(data: {
  title: string;
  district: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  description: string;
  category: 'Natural Attraction' | 'Historical Place' | 'Cultural Heritage' | 'Coastal Point' | 'Other';
  attractions: string[];
  directions: string;
  nearbyPlaces: string[];
}) {
  try {
    const item = await dbService.createLocation(data);
    revalidatePath('/locations');
    revalidatePath('/admin/locations');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLocationAction(id: string) {
  try {
    await dbService.deleteLocation(id);
    revalidatePath('/locations');
    revalidatePath('/admin/locations');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// TEAM CRUD
export async function createTeamMemberAction(data: {
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
}) {
  try {
    const item = await dbService.createTeamMember(data);
    revalidatePath('/team');
    revalidatePath('/admin/team');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    await dbService.deleteTeamMember(id);
    revalidatePath('/team');
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNewsAction() {
  try {
    return { success: true, data: JSON.parse(JSON.stringify(await dbService.getNews())) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getEventsAction() {
  try {
    return { success: true, data: JSON.parse(JSON.stringify(await dbService.getEvents())) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLocationsAction() {
  try {
    return { success: true, data: JSON.parse(JSON.stringify(await dbService.getLocations())) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTeamAction() {
  try {
    return { success: true, data: JSON.parse(JSON.stringify(await dbService.getTeam())) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerUserAction(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    if (!data.name || !data.email || !data.password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const user = await dbService.createUser(data);
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message || 'Registration failed.' };
  }
}
