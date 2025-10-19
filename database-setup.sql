-- OurCabin Database Schema Setup
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- 1. CREATE TABLES
-- =============================================================================

-- Create users table (references auth.users but doesn't modify it)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cabins table
CREATE TABLE public.cabins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cabin_id UUID REFERENCES public.cabins(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  text TEXT NOT NULL,
  image_urls TEXT[],
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cabin_id UUID REFERENCES public.cabins(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cabin_id UUID REFERENCES public.cabins(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 3. CREATE RLS POLICIES
-- =============================================================================

-- Users policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cabin policies
CREATE POLICY "Cabin members can read cabin" ON public.cabins
  FOR SELECT USING (
    created_by = auth.uid()
  );

CREATE POLICY "Users can create cabins" ON public.cabins
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Cabin creators can update cabins" ON public.cabins
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Cabin creators can delete cabins" ON public.cabins
  FOR DELETE USING (auth.uid() = created_by);

-- Posts policies
CREATE POLICY "Cabin members can read posts" ON public.posts
  FOR SELECT USING (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- Tasks policies
CREATE POLICY "Cabin members can read tasks" ON public.tasks
  FOR SELECT USING (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Cabin members can create tasks" ON public.tasks
  FOR INSERT WITH CHECK (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Cabin members can update tasks" ON public.tasks
  FOR UPDATE USING (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Cabin members can delete tasks" ON public.tasks
  FOR DELETE USING (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

-- Bookings policies
CREATE POLICY "Cabin members can read bookings" ON public.bookings
  FOR SELECT USING (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Cabin members can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    ) AND auth.uid() = user_id
  );

CREATE POLICY "Cabin creators can update bookings" ON public.bookings
  FOR UPDATE USING (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Cabin members can read comments" ON public.comments
  FOR SELECT USING (
    post_id IN (
      SELECT id FROM public.posts WHERE cabin_id IN (
        SELECT id FROM public.cabins WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Cabin members can create comments" ON public.comments
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    post_id IN (
      SELECT id FROM public.posts WHERE cabin_id IN (
        SELECT id FROM public.cabins WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- =============================================================================
-- 4. CREATE FUNCTIONS
-- =============================================================================

-- Function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts 
  SET likes = likes + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a task
CREATE OR REPLACE FUNCTION complete_task(task_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.tasks 
  SET status = 'done', completed_at = NOW()
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for better query performance
CREATE INDEX idx_posts_cabin_id ON public.posts(cabin_id);
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

CREATE INDEX idx_tasks_cabin_id ON public.tasks(cabin_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);

CREATE INDEX idx_bookings_cabin_id ON public.bookings(cabin_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);

CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);

-- =============================================================================
-- 6. VERIFY SETUP
-- =============================================================================

-- Check that all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'cabins', 'posts', 'tasks', 'bookings', 'comments');

-- Check that RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'cabins', 'posts', 'tasks', 'bookings', 'comments');
