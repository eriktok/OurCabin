import { supabase } from '../config/supabase';
import { ICabinApiService } from '../core/services/ICabinApiService';
import { Booking, Cabin, Comment, Post, Task, User } from '../core/models';

export class RealSupabaseService implements ICabinApiService {
  // Auth
  async signInWithGoogle(): Promise<User> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) throw error;
    
    // Get user data after sign in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');
    
    return {
      id: user.id,
      displayName: user.user_metadata?.full_name || user.email || 'User',
      email: user.email,
      photoUrl: user.user_metadata?.avatar_url,
    };
  }

  async signInWithVipps(): Promise<User> {
    // Vipps integration would go here
    // For now, return a demo user
    return { id: 'demo', displayName: 'Demo User' };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            displayName: session.user.user_metadata?.full_name || session.user.email || 'User',
            email: session.user.email,
            photoUrl: session.user.user_metadata?.avatar_url,
          };
          callback(user);
        } else {
          callback(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    return {
      id: user.id,
      displayName: user.user_metadata?.full_name || user.email || 'User',
      email: user.email,
      photoUrl: user.user_metadata?.avatar_url,
    };
  }

  // Posts
  async getPosts(cabinId: string, limit: number): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('cabin_id', cabinId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(post => ({
      id: post.id,
      cabinId: post.cabin_id,
      authorId: post.author_id,
      text: post.text,
      imageUrls: post.image_urls,
      createdAt: post.created_at,
      likes: post.likes || 0,
    }));
  }

  async createPost(cabinId: string, postData: { text: string; imageUrls?: string[] }): Promise<Post> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('posts')
      .insert({
        cabin_id: cabinId,
        author_id: user.id,
        text: postData.text,
        image_urls: postData.imageUrls,
        likes: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      authorId: data.author_id,
      text: data.text,
      imageUrls: data.image_urls,
      createdAt: data.created_at,
      likes: data.likes,
    };
  }

  async likePost(postId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_likes', { post_id: postId });
    if (error) throw error;
  }

  async getComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(comment => ({
      id: comment.id,
      postId: comment.post_id,
      authorId: comment.author_id,
      text: comment.text,
      createdAt: comment.created_at,
    }));
  }

  async addComment(postId: string, text: string): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: user.id,
        text,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      postId: data.post_id,
      authorId: data.author_id,
      text: data.text,
      createdAt: data.created_at,
    };
  }

  // Tasks
  async getTasks(cabinId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('cabin_id', cabinId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(task => ({
      id: task.id,
      cabinId: task.cabin_id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.created_at,
      completedAt: task.completed_at,
    }));
  }

  async createTask(cabinId: string, taskData: { title: string; description?: string }): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        cabin_id: cabinId,
        title: taskData.title,
        description: taskData.description,
        status: 'todo',
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: data.created_at,
      completedAt: data.completed_at,
    };
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const updateData: any = {};
    if (updates.status) updateData.status = updates.status;
    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status === 'done') updateData.completed_at = new Date().toISOString();

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId);

    if (error) throw error;
  }

  // Bookings
  async getBookings(cabinId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('cabin_id', cabinId)
      .order('start_date', { ascending: true });

    if (error) throw error;

    return (data || []).map(booking => ({
      id: booking.id,
      cabinId: booking.cabin_id,
      userId: booking.user_id,
      startDate: booking.start_date,
      endDate: booking.end_date,
      createdAt: booking.created_at,
      status: booking.status,
    }));
  }

  async requestBooking(cabinId: string, range: { startDate: string; endDate: string }): Promise<Booking> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        cabin_id: cabinId,
        user_id: user.id,
        start_date: range.startDate,
        end_date: range.endDate,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      userId: data.user_id,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      status: data.status,
    };
  }

  async approveBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'approved' })
      .eq('id', bookingId);

    if (error) throw error;
  }

  // Cabins
  async listCabinsForUser(userId: string): Promise<Cabin[]> {
    const { data, error } = await supabase
      .from('cabins')
      .select('*')
      .eq('created_by', userId);

    if (error) throw error;

    return (data || []).map(cabin => ({
      id: cabin.id,
      name: cabin.name,
      photoUrl: cabin.photo_url,
    }));
  }

  async createCabin(name: string): Promise<Cabin> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cabins')
      .insert({
        name,
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
  }

  async joinCabin(inviteCode: string): Promise<Cabin> {
    // This would need to be implemented with a proper invite system
    // For now, return a demo cabin
    return { id: 'joined-' + inviteCode, name: 'Joined Cabin' };
  }

  async generateInviteCode(cabinId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user is cabin owner
    const { data: cabin, error: cabinError } = await supabase
      .from('cabins')
      .select('created_by')
      .eq('id', cabinId)
      .single();

    if (cabinError) throw cabinError;
    if (cabin.created_by !== user.id) throw new Error('Only cabin owners can generate invite codes');

    // Generate a unique invite code
    const inviteCode = 'INVITE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Store the invite code
    const { error } = await supabase
      .from('invite_codes')
      .insert({
        cabin_id: cabinId,
        code: inviteCode,
        created_by: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });

    if (error) throw error;
    return inviteCode;
  }

  async getInviteCodeDetails(inviteCode: string): Promise<{ cabinId: string; cabinName: string; expiresAt: string } | null> {
    const { data, error } = await supabase
      .from('invite_codes')
      .select(`
        cabin_id,
        expires_at,
        cabins!inner(name)
      `)
      .eq('code', inviteCode)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) return null;

    return {
      cabinId: data.cabin_id,
      cabinName: data.cabins.name,
      expiresAt: data.expires_at,
    };
  }

  async deleteInviteCode(inviteCode: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('invite_codes')
      .delete()
      .eq('code', inviteCode)
      .eq('created_by', user.id);

    if (error) throw error;
  }

  async rejectBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', bookingId);

    if (error) throw error;
  }

  async getCabins(): Promise<Cabin[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cabins')
      .select('*')
      .eq('created_by', user.id);

    if (error) throw error;

    return (data || []).map(cabin => ({
      id: cabin.id,
      name: cabin.name,
      photoUrl: cabin.photo_url,
    }));
  }

  async createCabin(name: string): Promise<Cabin> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cabins')
      .insert({
        name,
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
  }

  async joinCabin(inviteCode: string): Promise<Cabin> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get invite code details
    const inviteDetails = await this.getInviteCodeDetails(inviteCode);
    if (!inviteDetails) throw new Error('Invalid or expired invite code');

    // Add user to cabin (this would need a cabin_members table)
    const { error } = await supabase
      .from('cabin_members')
      .insert({
        cabin_id: inviteDetails.cabinId,
        user_id: user.id,
        role: 'member',
      });

    if (error) throw error;

    return {
      id: inviteDetails.cabinId,
      name: inviteDetails.cabinName,
      photoUrl: null,
    };
  }

  async createComment(postId: string, text: string): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: user.id,
        text,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      postId: data.post_id,
      authorId: data.author_id,
      text: data.text,
      createdAt: data.created_at,
    };
  }
}

export const realSupabaseService = new RealSupabaseService();
