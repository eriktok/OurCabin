#!/bin/bash

# OurCabin POC Setup Script
# This script will set up your POC with real Supabase backend

echo "🏠 OurCabin POC Setup"
echo "===================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    ./setup-env.sh
    echo ""
    echo "⚠️  IMPORTANT: You need to update .env with your actual Supabase credentials"
    echo "   Get them from: https://supabase.com/dashboard"
    echo "   Go to Settings → API"
    echo ""
    echo "Press Enter when you've updated .env with your credentials..."
    read
fi

# Check if environment variables are set
source .env 2>/dev/null || true

if [ "$SUPABASE_URL" = "https://your-project-id.supabase.co" ] || [ -z "$SUPABASE_URL" ]; then
    echo "❌ SUPABASE_URL not configured"
    echo "   Please update .env with your actual Supabase URL"
    exit 1
fi

if [ "$SUPABASE_ANON_KEY" = "your-anon-key-here" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ SUPABASE_ANON_KEY not configured"
    echo "   Please update .env with your actual Supabase anon key"
    exit 1
fi

echo "✅ Environment variables configured"
echo "   URL: $SUPABASE_URL"
echo "   Key: ${SUPABASE_ANON_KEY:0:20}..."
echo ""

# Test Supabase connection
echo "🔌 Testing Supabase connection..."
if npm run test:supabase; then
    echo "✅ Supabase connection successful!"
else
    echo "❌ Supabase connection failed"
    echo "   Please check your credentials and try again"
    exit 1
fi

echo ""
echo "🎉 POC Setup Complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Start your app: npm start"
echo "2. Test authentication and data operations"
echo "3. Create posts, tasks, and bookings"
echo ""
echo "📱 Your POC now has:"
echo "   ✅ Real Supabase backend"
echo "   ✅ Data persistence"
echo "   ✅ User authentication"
echo "   ✅ All core features working"
echo ""
echo "🎯 Ready to demo your POC!"
