import { createClient } from '@supabase/supabase-js';

// These should be set in your .env file
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types (you'll need to generate these from your Supabase project)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          email: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          email?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          email?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
      };
      cabins: {
        Row: {
          id: string;
          name: string;
          photo_url: string | null;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          photo_url?: string | null;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          photo_url?: string | null;
          created_at?: string;
          created_by?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          cabin_id: string;
          author_id: string;
          text: string;
          image_urls: string[] | null;
          likes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cabin_id: string;
          author_id: string;
          text: string;
          image_urls?: string[] | null;
          likes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cabin_id?: string;
          author_id?: string;
          text?: string;
          image_urls?: string[] | null;
          likes?: number;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          cabin_id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'done';
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          cabin_id: string;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          cabin_id?: string;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          completed_at?: string | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          cabin_id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          status: 'pending' | 'approved';
          created_at: string;
        };
        Insert: {
          id?: string;
          cabin_id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          status?: 'pending' | 'approved';
          created_at?: string;
        };
        Update: {
          id?: string;
          cabin_id?: string;
          user_id?: string;
          start_date?: string;
          end_date?: string;
          status?: 'pending' | 'approved';
          created_at?: string;
        };
      };
    };
  };
};
