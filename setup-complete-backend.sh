#!/bin/bash

# Complete Supabase Backend Setup for OurCabin
# This script sets up both database schema and storage

echo "🏠 OurCabin Complete Backend Setup"
echo "=================================="

# Check if .env file exists and has real values
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please run ./setup-supabase.sh first"
    exit 1
fi

# Check if environment variables are set
if grep -q "your-project-id" .env; then
    echo "❌ Please update your .env file with real Supabase credentials first"
    echo "   Run: npm run setup:supabase"
    exit 1
fi

echo "✅ Environment variables configured"

# Test connection first
echo ""
echo "🔍 Testing Supabase connection..."
npm run test:supabase

if [ $? -ne 0 ]; then
    echo "❌ Supabase connection test failed. Please check your credentials."
    exit 1
fi

echo ""
echo "📊 Setting up database schema..."
echo "1. Go to your Supabase dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy and paste the contents of 'database-setup.sql'"
echo "4. Click 'Run' to create all tables and policies"

echo ""
echo "🗄️ Setting up storage..."
echo "1. In your Supabase dashboard, go to SQL Editor"
echo "2. Copy and paste the contents of 'setup-storage.sql'"
echo "3. Click 'Run' to create storage bucket and policies"

echo ""
echo "🔐 Setting up authentication..."
echo "1. Go to Authentication > Providers in your Supabase dashboard"
echo "2. Enable Google OAuth if you want Google Sign-In"
echo "3. Configure your OAuth credentials"

echo ""
echo "🧪 Testing complete setup..."
echo "Run: npm run test:supabase"

echo ""
echo "🚀 Start your app:"
echo "npm start"

echo ""
echo "📖 For detailed instructions, see:"
echo "   - SUPABASE_QUICK_START.md"
echo "   - SUPABASE_SETUP.md"
