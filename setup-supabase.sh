#!/bin/bash

# OurCabin Supabase Setup Script
# This script helps you set up Supabase for the OurCabin project

echo "🏠 OurCabin Supabase Setup"
echo "=========================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cat > .env << EOF
# Supabase Configuration
# Get these values from your Supabase project dashboard > Settings > API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For development/testing
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
# For React Native, you might also need:
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Go to https://supabase.com and create a new project"
echo "2. Copy your project URL and anon key to the .env file"
echo "3. Run the database schema setup in your Supabase SQL editor"
echo "4. Configure authentication providers"
echo ""
echo "📖 For detailed instructions, see SUPABASE_SETUP.md"
echo ""
echo "🚀 Once configured, run: npm start"
