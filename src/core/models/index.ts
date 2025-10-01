export type Identifier = string;

export interface User {
  id: Identifier;
  displayName: string;
  email?: string;
  photoUrl?: string | null;
}

export interface Cabin {
  id: Identifier;
  name: string;
  photoUrl?: string | null;
}

export interface Post {
  id: Identifier;
  cabinId: Identifier;
  authorId: Identifier;
  authorName: string;
  text: string;
  imageUrls?: string[];
  createdAt: string;
  likes?: number;
}

export interface Task {
  id: Identifier;
  cabinId: Identifier;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: Identifier;
  assignedToName?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Booking {
  id: Identifier;
  cabinId: Identifier;
  userId: Identifier;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  createdAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Comment {
  id: Identifier;
  postId: Identifier;
  authorId: Identifier;
  authorName: string;
  text: string;
  content: string;
  createdAt: string;
}

export type { CabinSettings, CabinMember, CabinInvite } from './CabinSettings';

