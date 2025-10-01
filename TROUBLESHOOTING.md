# Troubleshooting Guide

## AsyncStorage Error Fix

If you encounter the error: `[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null`

### Solution 1: Rebuild the App
```bash
# Clean and rebuild
npx react-native start --reset-cache
cd ios && pod install && cd ..
npx react-native run-ios
```

### Solution 2: Manual Linking (if auto-linking fails)
```bash
# For iOS
cd ios && pod install && cd ..

# For Android - add to android/app/src/main/java/.../MainApplication.java
# import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
```

### Solution 3: Use Fallback Storage
The app now includes a fallback storage system that works without AsyncStorage for development.

## Common Issues

### Metro Bundler Issues
```bash
npx react-native start --reset-cache
```

### iOS Build Issues
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Network Issues
- Check your internet connection
- Ensure Supabase credentials are correct in `.env`
- Verify Supabase project is active

### Image Picker Issues
```bash
# iOS - add permissions to Info.plist
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select images</string>
```

### Push Notification Issues
```bash
# iOS - add to Info.plist
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

## Development Tips

1. **Use the fallback storage** during development if AsyncStorage causes issues
2. **Test on both iOS and Android** devices/simulators
3. **Check console logs** for detailed error messages
4. **Use React Native Debugger** for better debugging experience

## Production Deployment

1. **Test AsyncStorage** thoroughly before production
2. **Configure proper permissions** for camera and notifications
3. **Set up proper error boundaries** for production
4. **Monitor app performance** and user feedback
