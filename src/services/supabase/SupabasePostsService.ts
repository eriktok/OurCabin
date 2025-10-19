import { supabase } from '../../config/supabase';
import { Comment, Post } from '../../core/models';
import { BaseSupabaseService } from './BaseSupabaseService';

/**
 * Handles all posts and comments operations with Supabase
 * Single Responsibility: Posts and Comments only
 */
export class SupabasePostsService extends BaseSupabaseService {
  /**
   * Get posts for a cabin
   */
  async getPosts(cabinId: string, limit: number = 50): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          cabin_id,
          author_id,
          text,
          image_urls,
          likes,
          created_at,
          users(display_name)
        `)
        .eq('cabin_id', cabinId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(post => ({
        id: post.id,
        cabinId: post.cabin_id,
        authorId: post.author_id,
        authorName: (post.users as any)?.display_name || 'Unknown',
        text: post.text,
        imageUrls: post.image_urls || [],
        likes: post.likes || 0,
        createdAt: post.created_at,
      }));
    } catch (error) {
      console.error('Get posts error:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  /**
   * Create a new post
   */
  async createPost(
    cabinId: string,
    postData: { text: string; imageUrls?: string[] }
  ): Promise<Post> {
    try {
      const user = await this.requireAuth();

      const { data, error } = await supabase
        .from('posts')
        .insert({
          cabin_id: cabinId,
          author_id: user.id,
          text: postData.text,
          image_urls: postData.imageUrls || [],
        })
        .select(`
          id,
          cabin_id,
          author_id,
          text,
          image_urls,
          likes,
          created_at,
          users(display_name)
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        cabinId: data.cabin_id,
        authorId: data.author_id,
        authorName: (data.users as any)?.display_name || 'Unknown',
        text: data.text,
        imageUrls: data.image_urls || [],
        likes: data.likes || 0,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Create post error:', error);
      throw new Error('Failed to create post');
    }
  }

  /**
   * Like a post
   */
  async likePost(postId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_likes', {
        post_id: postId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Like post error:', error);
      throw new Error('Failed to like post');
    }
  }

  /**
   * Get comments for a post
   */
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          post_id,
          author_id,
          text,
          created_at,
          users!comments_author_id_fkey(display_name)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(comment => ({
        id: comment.id,
        postId: comment.post_id,
        authorId: comment.author_id,
        authorName: (comment.users as any)?.display_name || 'Unknown',
        text: comment.text,
        content: comment.text,
        createdAt: comment.created_at,
      }));
    } catch (error) {
      console.error('Get comments error:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, text: string): Promise<Comment> {
    return this.createComment(postId, text);
  }

  /**
   * Create a comment
   */
  async createComment(postId: string, text: string): Promise<Comment> {
    try {
      const user = await this.requireAuth();

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          text: text,
        })
        .select(`
          id,
          post_id,
          author_id,
          text,
          created_at,
          users!comments_author_id_fkey(display_name)
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        postId: data.post_id,
        authorId: data.author_id,
        authorName: (data.users as any)?.display_name || 'Unknown',
        text: data.text,
        content: data.text,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Create comment error:', error);
      throw new Error('Failed to create comment');
    }
  }
}
