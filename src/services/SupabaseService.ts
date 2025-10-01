import { ICabinApiService } from '../core/services/ICabinApiService';
import { Booking, Cabin, Comment, Post, Task, User } from '../core/models';

export class SupabaseService implements ICabinApiService {
  // Auth (stubs)
  async signInWithGoogle(): Promise<User> {
    return { id: 'demo', displayName: 'Demo User' };
  }
  async signInWithVipps(): Promise<User> {
    return { id: 'demo', displayName: 'Demo User' };
  }
  async signOut(): Promise<void> {
    return;
  }
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    callback({ id: 'demo', displayName: 'Demo User' });
    return () => undefined;
  }
  async getCurrentUser(): Promise<User | null> {
    return { id: 'demo', displayName: 'Demo User' };
  }

  // Posts
  async getPosts(cabinId: string, limit: number): Promise<Post[]> {
    return [
      {
        id: 'p1',
        cabinId,
        authorId: 'demo',
        text: 'Welcome to Our Cabin! 🏡',
        createdAt: new Date().toISOString(),
      },
    ];
  }
  async createPost(
    cabinId: string,
    postData: { text: string; imageUrls?: string[] }
  ): Promise<Post> {
    return {
      id: Math.random().toString(36).slice(2),
      cabinId,
      authorId: 'demo',
      text: postData.text,
      imageUrls: postData.imageUrls,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
  }
  async likePost(postId: string): Promise<void> {
    return;
  }
  async getComments(postId: string): Promise<Comment[]> {
    return [];
  }
  async addComment(postId: string, text: string): Promise<Comment> {
    return {
      id: Math.random().toString(36).slice(2),
      postId,
      authorId: 'demo',
      text,
      createdAt: new Date().toISOString(),
    };
  }

  // Tasks
  async getTasks(cabinId: string): Promise<Task[]> {
    return [
      {
        id: 't1',
        cabinId,
        title: 'Restock firewood',
        status: 'todo',
        createdAt: new Date().toISOString(),
      },
    ];
  }
  async createTask(
    cabinId: string,
    taskData: { title: string; description?: string }
  ): Promise<Task> {
    return {
      id: Math.random().toString(36).slice(2),
      cabinId,
      title: taskData.title,
      description: taskData.description,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };
  }
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    return;
  }

  // Bookings
  async getBookings(cabinId: string): Promise<Booking[]> {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    return [
      {
        id: 'b1',
        cabinId,
        userId: 'demo',
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        createdAt: today.toISOString(),
        status: 'approved',
      },
    ];
  }
  async requestBooking(cabinId: string, range: { startDate: string; endDate: string }): Promise<Booking> {
    return {
      id: Math.random().toString(36).slice(2),
      cabinId,
      userId: 'demo',
      startDate: range.startDate,
      endDate: range.endDate,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
  }
  async approveBooking(bookingId: string): Promise<void> {
    return;
  }

  // Cabins (stubs)
  async listCabinsForUser(userId: string): Promise<Cabin[]> {
    return [
      { id: 'demo-cabin', name: 'Tokheim Family Cabin' },
    ];
  }
  async createCabin(name: string): Promise<Cabin> {
    return { id: Math.random().toString(36).slice(2), name };
  }
  async joinCabin(inviteCode: string): Promise<Cabin> {
    return { id: 'joined-' + inviteCode, name: 'Joined Cabin' };
  }
  async generateInviteCode(cabinId: string): Promise<string> {
    return 'INVITE-' + cabinId.slice(0, 4).toUpperCase();
  }
}

export const cabinApiService: ICabinApiService = new SupabaseService();


