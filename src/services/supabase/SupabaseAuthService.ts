import { supabase } from '../../config/supabase';
import { User } from '../../core/models';
import { BaseSupabaseService } from './BaseSupabaseService';

/**
 * Handles all authentication operations with Supabase
 * Single Responsibility: Authentication only
 */
export class SupabaseAuthService extends BaseSupabaseService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'ourcabin://auth/callback'
        }
      });

      if (error) throw error;

      // Get user data after successful auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user data received');

      const userData: User = {
        id: user.id,
        displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        photoUrl: user.user_metadata?.avatar_url || null,
      };

      // Store user in our users table
      await this.upsertUser(userData);
      this.setCurrentUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  /**
   * Sign in with Vipps (mock implementation)
   */
  async signInWithVipps(): Promise<User> {
    // For now, return a mock user since Vipps integration is complex
    const user: User = {
      id: 'vipps-user-' + Date.now(),
      displayName: 'Vipps User',
      email: 'user@vipps.no',
      photoUrl: null,
    };

    await this.upsertUser(user);
    this.setCurrentUser(user);
    return user;
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.setCurrentUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            photoUrl: session.user.user_metadata?.avatar_url || null,
          };
          
          await this.upsertUser(userData);
          this.setCurrentUser(userData);
          callback(userData);
        } else {
          this.setCurrentUser(null);
          callback(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<User | null> {
    return super.getCurrentUser();
  }
}
