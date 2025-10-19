#!/bin/bash

# OurCabin Environment Setup Script
echo "🏠 Setting up OurCabin environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# OurCabin Environment Configuration
# Update these values with your actual Supabase credentials

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For development/testing
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# Development flags
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Update .env with your actual Supabase credentials"
echo "2. Run: npm run test:supabase"
echo "3. Run: npm start"
echo ""
echo "📖 Get your credentials from: https://supabase.com/dashboard"
echo "   Go to Settings → API to find your URL and anon key"
