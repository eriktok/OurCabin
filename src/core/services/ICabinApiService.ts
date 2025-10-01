import { User, Task, Post, Booking } from '../models';

export interface ICabinApiService {
  // Auth
  signInWithGoogle(): Promise<User>;
  signInWithVipps(): Promise<User>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;

  // Posts (Logbook)
  getPosts(cabinId: string, limit: number): Promise<Post[]>;
  createPost(
    cabinId: string,
    postData: { text: string; imageUrls?: string[] }
  ): Promise<Post>;

  // Tasks
  getTasks(cabinId: string): Promise<Task[]>;
  createTask(
    cabinId: string,
    taskData: { title: string; description?: string }
  ): Promise<Task>;
  updateTask(taskId: string, updates: Partial<Task>): Promise<void>;

  // Booking (MVP basic)
  getBookings(cabinId: string): Promise<Booking[]>;
}


