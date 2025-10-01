# Supabase Setup Guide

This guide will help you set up a real Supabase backend for the OurCabin app.

## 1. Create Supabase Project
### 62IpVDanOrQfi7EW
1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: `ourcabin`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
4. Click "Create new project"

## 2. Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
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

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cabin members can read cabin data
CREATE POLICY "Cabin members can read cabin" ON public.cabins
  FOR SELECT USING (
    created_by = auth.uid()
  );

-- Cabin creators can insert cabins
CREATE POLICY "Users can create cabins" ON public.cabins
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Cabin members can read posts
CREATE POLICY "Cabin members can read posts" ON public.posts
  FOR SELECT USING (
    cabin_id IN (
      SELECT id FROM public.cabins WHERE created_by = auth.uid()
    )
  );

-- Authenticated users can create posts
CREATE POLICY "Users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authenticated users can update posts
CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

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

-- Create function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts 
  SET likes = likes + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 3. Environment Variables

Update your `.env` file with your Supabase credentials:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase project settings under "API".

## 4. Authentication Setup

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google OAuth:
   - Add your Google OAuth credentials
   - Set redirect URL to your app's URL scheme
3. Configure your app's URL scheme in the redirect URLs

## 5. Storage Setup (Optional)

If you want to store images in Supabase Storage:

1. Go to Storage in your Supabase dashboard
2. Create a bucket called `cabin-images`
3. Set up storage policies for authenticated users

## 6. Testing

1. Set your environment variables
2. Run the app: `npm start`
3. Test authentication and data operations

## 7. Production Considerations

- Set up proper RLS policies for production
- Configure CORS settings
- Set up database backups
- Monitor usage and performance
- Set up proper error handling and logging
