#!/bin/bash

# OurCabin React Native Project Setup Script
# This script helps set up the development environment for new contributors

set -e

echo "🚀 Setting up OurCabin React Native project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js >= 20"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js version 20 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm or yarn is available
if command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    print_status "Using Yarn as package manager"
else
    PACKAGE_MANAGER="npm"
    print_status "Using npm as package manager"
fi

# Install dependencies
print_status "Installing dependencies..."
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install
else
    npm install
fi

# Set up environment variables
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        print_status "Creating .env file from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_warning ".env.example not found. You may need to create .env manually"
    fi
else
    print_status ".env file already exists"
fi

# iOS setup (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -d "ios" ]; then
        print_status "Setting up iOS dependencies..."
        cd ios
        
        # Check if bundle is available
        if command -v bundle &> /dev/null; then
            print_status "Installing Ruby gems..."
            bundle install
            
            print_status "Installing CocoaPods dependencies..."
            bundle exec pod install
        else
            print_warning "Bundle not found. Installing CocoaPods dependencies with pod install..."
            pod install
        fi
        
        cd ..
        print_status "iOS setup completed"
    fi
else
    print_warning "Not on macOS - skipping iOS setup"
fi

# Android setup
if [ -d "android" ]; then
    print_status "Android project detected"
    print_warning "Make sure you have Android Studio and Android SDK installed"
    print_warning "Set ANDROID_HOME environment variable if not already set"
fi

# Check for React Native CLI
if ! command -v react-native &> /dev/null; then
    print_warning "React Native CLI not found globally. Using npx/react-native"
fi

# Create necessary directories if they don't exist
mkdir -p src/{components,screens,services,core,assets}

print_status "Project setup completed! 🎉"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start the Metro bundler: $PACKAGE_MANAGER start"
echo "3. Run the app: $PACKAGE_MANAGER run android or $PACKAGE_MANAGER run ios"
echo ""
echo "For more information, see README.md"
