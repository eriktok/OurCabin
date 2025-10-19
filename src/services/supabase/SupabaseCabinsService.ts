import { supabase } from '../../config/supabase';
import { Cabin } from '../../core/models';
import { BaseSupabaseService } from './BaseSupabaseService';

/**
 * Handles all cabins operations with Supabase
 * Single Responsibility: Cabins only
 */
export class SupabaseCabinsService extends BaseSupabaseService {
  /**
   * List cabins for a user
   */
  async listCabinsForUser(userId: string): Promise<Cabin[]> {
    try {
      const { data, error } = await supabase
        .from('cabins')
        .select(`
          id,
          name,
          photo_url,
          created_at
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(cabin => ({
        id: cabin.id,
        name: cabin.name,
        photoUrl: cabin.photo_url,
      }));
    } catch (error) {
      console.error('List cabins error:', error);
      throw new Error('Failed to fetch cabins');
    }
  }

  /**
   * Create a new cabin
   */
  async createCabin(name: string): Promise<Cabin> {
    try {
      const user = await this.requireAuth();

      const { data, error } = await supabase
        .from('cabins')
        .insert({
          name: name,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        photoUrl: data.photo_url,
      };
    } catch (error) {
      console.error('Create cabin error:', error);
      throw new Error('Failed to create cabin');
    }
  }

  /**
   * Join a cabin using invite code
   * Note: This is a simplified implementation
   * In a real app, you'd have an invite codes table
   */
  async joinCabin(inviteCode: string): Promise<Cabin> {
    try {
      await this.requireAuth();

      // This is a mock implementation - you'd need to implement invite codes
      const mockCabin: Cabin = {
        id: 'joined-' + inviteCode,
        name: 'Joined Cabin',
      };

      return mockCabin;
    } catch (error) {
      console.error('Join cabin error:', error);
      throw new Error('Failed to join cabin');
    }
  }

  /**
   * Generate an invite code for a cabin
   * Note: This is a simplified implementation
   * In a real app, you'd store this in a database
   */
  async generateInviteCode(cabinId: string): Promise<string> {
    // For now, return a simple invite code
    // In a real app, you'd store this in a database
    return 'INVITE-' + cabinId.slice(0, 4).toUpperCase();
  }
}
