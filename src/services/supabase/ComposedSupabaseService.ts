import { ICabinApiService } from '../../core/services/ICabinApiService';
import { Booking, Cabin, Comment, Post, Task, User } from '../../core/models';
import { SupabaseAuthService } from './SupabaseAuthService';
import { SupabasePostsService } from './SupabasePostsService';
import { SupabaseTasksService } from './SupabaseTasksService';
import { SupabaseBookingsService } from './SupabaseBookingsService';
import { SupabaseCabinsService } from './SupabaseCabinsService';

/**
 * Composed Supabase Service that aggregates all domain services
 * Follows Composition over Inheritance principle
 * Single Responsibility: Orchestrating domain services
 */
export class ComposedSupabaseService implements ICabinApiService {
  private authService: SupabaseAuthService;
  private postsService: SupabasePostsService;
  private tasksService: SupabaseTasksService;
  private bookingsService: SupabaseBookingsService;
  private cabinsService: SupabaseCabinsService;

  constructor() {
    // Initialize all domain services
    this.authService = new SupabaseAuthService();
    this.postsService = new SupabasePostsService();
    this.tasksService = new SupabaseTasksService();
    this.bookingsService = new SupabaseBookingsService();
    this.cabinsService = new SupabaseCabinsService();

    // Sync current user across all services
    this.syncUserAcrossServices();
  }

  // =============================================================================
  // AUTHENTICATION METHODS - Delegated to AuthService
  // =============================================================================

  async signInWithGoogle(): Promise<User> {
    const user = await this.authService.signInWithGoogle();
    this.syncUserAcrossServices();
    return user;
  }

  async signInWithVipps(): Promise<User> {
    const user = await this.authService.signInWithVipps();
    this.syncUserAcrossServices();
    return user;
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    this.syncUserAcrossServices();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authService.onAuthStateChanged((user) => {
      this.syncUserAcrossServices();
      callback(user);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authService.getCurrentUser();
  }

  // =============================================================================
  // POSTS METHODS - Delegated to PostsService
  // =============================================================================

  async getPosts(cabinId: string, limit: number): Promise<Post[]> {
    return this.postsService.getPosts(cabinId, limit);
  }

  async createPost(
    cabinId: string,
    postData: { text: string; imageUrls?: string[] }
  ): Promise<Post> {
    return this.postsService.createPost(cabinId, postData);
  }

  async likePost(postId: string): Promise<void> {
    return this.postsService.likePost(postId);
  }

  async getComments(postId: string): Promise<Comment[]> {
    return this.postsService.getComments(postId);
  }

  async addComment(postId: string, text: string): Promise<Comment> {
    return this.postsService.addComment(postId, text);
  }

  async createComment(postId: string, text: string): Promise<Comment> {
    return this.postsService.createComment(postId, text);
  }

  // =============================================================================
  // TASKS METHODS - Delegated to TasksService
  // =============================================================================

  async getTasks(cabinId: string): Promise<Task[]> {
    return this.tasksService.getTasks(cabinId);
  }

  async createTask(
    cabinId: string,
    taskData: { title: string; description?: string; priority?: 'low' | 'medium' | 'high'; dueDate?: string; assignedTo?: string }
  ): Promise<Task> {
    return this.tasksService.createTask(cabinId, taskData);
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    return this.tasksService.updateTask(taskId, updates);
  }

  async assignTask(taskId: string, userId: string): Promise<void> {
    return this.tasksService.assignTask(taskId, userId);
  }

  // =============================================================================
  // BOOKINGS METHODS - Delegated to BookingsService
  // =============================================================================

  async getBookings(cabinId: string): Promise<Booking[]> {
    return this.bookingsService.getBookings(cabinId);
  }

  async requestBooking(cabinId: string, range: { startDate: string; endDate: string }): Promise<Booking> {
    return this.bookingsService.requestBooking(cabinId, range);
  }

  async approveBooking(bookingId: string): Promise<void> {
    return this.bookingsService.approveBooking(bookingId);
  }

  async rejectBooking(bookingId: string): Promise<void> {
    return this.bookingsService.rejectBooking(bookingId);
  }

  // =============================================================================
  // CABINS METHODS - Delegated to CabinsService
  // =============================================================================

  async listCabinsForUser(userId: string): Promise<Cabin[]> {
    return this.cabinsService.listCabinsForUser(userId);
  }

  async createCabin(name: string): Promise<Cabin> {
    return this.cabinsService.createCabin(name);
  }

  async joinCabin(inviteCode: string): Promise<Cabin> {
    return this.cabinsService.joinCabin(inviteCode);
  }

  async generateInviteCode(cabinId: string): Promise<string> {
    return this.cabinsService.generateInviteCode(cabinId);
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Sync the current user across all services
   * Ensures all services have the same user context
   */
  private async syncUserAcrossServices(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    
    // Set the same user in all services
    this.postsService.setCurrentUser(user);
    this.tasksService.setCurrentUser(user);
    this.bookingsService.setCurrentUser(user);
    this.cabinsService.setCurrentUser(user);
  }
}

export const composedSupabaseService: ICabinApiService = new ComposedSupabaseService();
