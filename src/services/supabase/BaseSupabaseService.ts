import { supabase } from '../../config/supabase';
import { User } from '../../core/models';

/**
 * Base service class for Supabase operations
 * Provides common functionality and user management
 */
export abstract class BaseSupabaseService {
  protected currentUser: User | null = null;

  /**
   * Get the current authenticated user
   */
  protected async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const userData: User = {
        id: user.id,
        displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        photoUrl: user.user_metadata?.avatar_url || null,
      };

      this.currentUser = userData;
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Ensure user is authenticated, throw error if not
   */
  protected async requireAuth(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  /**
   * Store user data in the users table
   */
  protected async upsertUser(user: User): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          display_name: user.displayName,
          email: user.email,
          photo_url: user.photoUrl,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Upsert user error:', error);
      // Don't throw here as it's not critical for the main flow
    }
  }

  /**
   * Set the current user (used by auth service)
   */
  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }
}
