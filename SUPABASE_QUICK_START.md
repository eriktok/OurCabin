# 🏠 OurCabin Supabase Quick Start Guide

This guide will get your Supabase backend up and running in 10 minutes!

## 🚀 Quick Setup (5 steps)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `ourcabin` (or `ourcabin-dev`)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait 1-2 minutes

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon key**
3. Run the setup script:
   ```bash
   npm run setup:supabase
   ```
4. Update the `.env` file with your actual credentials

### 3. Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `database-setup.sql`
3. Click "Run" to create all tables and policies

### 4. Test Your Connection
```bash
npm run test:supabase
```

### 5. Start Your App
```bash
npm start
```

## 🔧 Detailed Configuration

### Authentication Setup
1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** authentication (already enabled by default)
3. For Google Sign-In:
   - Enable **Google** provider
   - Add your Google OAuth credentials
   - Set redirect URLs for your app

### Storage Setup (Optional)
1. Go to **Storage** in your Supabase dashboard
2. Create a bucket called `cabin-images`
3. Set up storage policies for authenticated users

## 🧪 Testing Your Setup

### Test Database Connection
```bash
npm run test:supabase
```

### Test in Your App
1. Start your app: `npm start`
2. Try to sign up/sign in
3. Create a cabin
4. Add a post or task

## 🚨 Troubleshooting

### Common Issues

**"Invalid API key" error:**
- Check your `.env` file has the correct `SUPABASE_ANON_KEY`
- Make sure there are no extra spaces or quotes

**"Table doesn't exist" error:**
- Run the `database-setup.sql` script in your Supabase SQL Editor
- Check that all tables were created successfully

**"Permission denied" error:**
- Verify RLS policies are set up correctly
- Check that your user is authenticated

**Connection timeout:**
- Check your `SUPABASE_URL` is correct
- Verify your Supabase project is active (not paused)

### Getting Help
- Check the full setup guide: `SUPABASE_SETUP.md`
- Review the database schema: `database-setup.sql`
- Test your connection: `npm run test:supabase`

## 📁 Files Created

- `.env` - Your environment variables (don't commit this!)
- `database-setup.sql` - Complete database schema
- `test-supabase-connection.js` - Connection test script
- `setup-supabase.sh` - Quick setup script

## ✅ Next Steps

Once your Supabase setup is working:

1. **Configure Authentication**: Set up Google Sign-In or other providers
2. **Set Up Storage**: Configure image uploads if needed
3. **Deploy to Production**: Create a production Supabase project
4. **Monitor Usage**: Set up monitoring and alerts

## 🔒 Security Notes

- Never commit your `.env` file
- Keep your service role key secret
- Use RLS policies for data security
- Regularly review your database permissions

---

**Need help?** Check the detailed guide in `SUPABASE_SETUP.md` or run `npm run test:supabase` to diagnose issues.
