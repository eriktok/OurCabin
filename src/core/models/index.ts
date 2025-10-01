export type Identifier = string;

export interface User {
  id: Identifier;
  displayName: string;
  email?: string;
  photoUrl?: string;
}

export interface Cabin {
  id: Identifier;
  name: string;
  photoUrl?: string;
}

export interface Post {
  id: Identifier;
  cabinId: Identifier;
  authorId: Identifier;
  text: string;
  imageUrls?: string[];
  createdAt: string;
}

export interface Task {
  id: Identifier;
  cabinId: Identifier;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
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
}

