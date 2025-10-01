# 🏡 OurCabin - Shared Cabin Management App

A React Native app for families and groups who co-own cabins. Simplify communication, scheduling, and property management with a single, organized hub.

## ✨ Features

### 🔐 Authentication
- Google Sign-In integration
- Vipps authentication (Norway)
- Secure user session management

### 🏠 Cabin Management
- Create and join private cabin spaces
- Generate secure invitation codes
- Admin role assignment for cabin creators

### 📝 Logbook (Social Feed)
- Share text posts and photos
- Like posts and add comments
- Image upload from camera/gallery
- Chronological feed with newest first

### ✅ Task Management
- Create and assign tasks
- Track status (To Do → In Progress → Done)
- Collaborative task lists
- Mark tasks as complete

### 📅 Booking Calendar
- Request cabin stays
- Admin approval workflow
- View availability and conflicts
- Status tracking (pending/approved)

### ⚙️ Cabin Settings
- Generate invite codes
- Manage cabin members
- Sign out functionality

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- React Native development environment
- iOS: Xcode and CocoaPods
- Android: Android Studio and Android SDK

### Installation

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd OurCabin
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials (optional)
   ```

3. **iOS setup**
   ```bash
   cd ios && bundle install && bundle exec pod install && cd ..
   ```

4. **Run the app**
   ```bash
   npm start
   npm run ios    # or npm run android
   ```

## 🏗️ Architecture

### Repository Pattern
- **Interface-driven**: `ICabinApiService` abstracts data operations
- **Backend-agnostic**: Easy to swap Supabase for other backends
- **Type-safe**: Full TypeScript implementation

### Project Structure
```
src/
├── core/
│   ├── models/           # TypeScript interfaces
│   └── services/         # Service contracts
├── services/
│   ├── SupabaseService.ts    # Mock implementation
│   ├── RealSupabaseService.ts # Production Supabase
│   └── ServiceProvider.tsx   # Context provider
├── screens/              # Screen components
├── components/           # Reusable UI components
└── config/              # Configuration files
```

## 🔧 Development

### Running the App
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

### Code Quality
```bash
# Linting
npm run lint

# Testing
npm test
```

## 🗄️ Backend Setup

### Option 1: Mock Data (Default)
The app works out-of-the-box with mock data. No setup required!

### Option 2: Real Supabase Backend
For production use, follow the [Supabase Setup Guide](./SUPABASE_SETUP.md):

1. Create Supabase project
2. Run database schema
3. Configure environment variables
4. Set up authentication providers

## 🔐 Security

- **Environment Variables**: Never commit `.env` files
- **Row Level Security**: Supabase RLS policies protect data
- **Authentication**: Secure OAuth flows
- **Invite Codes**: Time-limited, single-use codes

## 📱 Screenshots

The app features a modern, clean interface with:
- Tab-based navigation
- Card-based layouts with shadows
- Image upload and preview
- Status indicators and toggles
- Responsive design

## 🚀 Deployment

### iOS
1. Configure signing in Xcode
2. Build and archive
3. Upload to App Store Connect

### Android
1. Generate signed APK/AAB
2. Upload to Google Play Console

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use TypeScript for all new code
3. Test on both iOS and Android
4. Update documentation for new features

## 📄 License

Private project - All rights reserved

## 🛠️ Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

**iOS build issues:**
```bash
cd ios && bundle exec pod install && cd ..
```

**Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
```

### Development Tips

- Use React Native Debugger for debugging
- Enable Fast Refresh for hot reloading
- Test on both iOS and Android devices
- Use TypeScript for better development experience

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)

## 🎯 Next Steps

1. **Set up Supabase backend** for production use
2. **Add push notifications** for task updates and bookings
3. **Implement offline support** with local data caching
4. **Add user profiles** and cabin member management
5. **Deploy to app stores** for distribution
