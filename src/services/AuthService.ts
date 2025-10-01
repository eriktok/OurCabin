import * as Keychain from 'react-native-keychain';
import { User } from '../core/models';
import { FallbackAuthService } from './FallbackAuthService';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private fallbackService: FallbackAuthService;
  private useFallback: boolean = false;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.fallbackService = FallbackAuthService.getInstance();
  }

  async initialize(): Promise<void> {
    try {
      // Try to dynamically import GoogleSignin
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
      
      GoogleSignin.configure({
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
    } catch (error) {
      console.warn('Google Sign-In module not available, using fallback:', error);
      this.useFallback = true;
      await this.fallbackService.initialize();
    }
  }

  async signInWithGoogle(): Promise<User> {
    if (this.useFallback) {
      return this.fallbackService.signInWithGoogle();
    }

    try {
      const { GoogleSignin, statusCodes } = await import('@react-native-google-signin/google-signin');
      
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const user: User = {
        id: (userInfo as any).data?.user?.id || (userInfo as any).user?.id || 'unknown',
        displayName: (userInfo as any).data?.user?.name || (userInfo as any).user?.name || 'User',
        email: (userInfo as any).data?.user?.email || (userInfo as any).user?.email || '',
        photoUrl: (userInfo as any).data?.user?.photo || (userInfo as any).user?.photo || null,
      };

      // Store user in keychain
      await this.storeUser(user);
      this.currentUser = user;
      
      return user;
    } catch (error: any) {
      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Sign-in was cancelled');
      } else if (error.code === 'IN_PROGRESS') {
        throw new Error('Sign-in is already in progress');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services not available');
      } else {
        throw new Error('Google sign-in failed: ' + error.message);
      }
    }
  }

  async signInWithVipps(): Promise<User> {
    if (this.useFallback) {
      return this.fallbackService.signInWithVipps();
    }

    // Vipps integration would go here
    // For now, return a mock user
    const user: User = {
      id: 'vipps-user-' + Date.now(),
      displayName: 'Vipps User',
      email: 'user@vipps.no',
      photoUrl: null,
    };

    await this.storeUser(user);
    this.currentUser = user;
    return user;
  }

  async signOut(): Promise<void> {
    if (this.useFallback) {
      return this.fallbackService.signOut();
    }

    try {
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google sign-out error:', error);
    }

    await this.clearStoredUser();
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.useFallback) {
      return this.fallbackService.getCurrentUser();
    }

    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const credentials = await Keychain.getInternetCredentials('ourcabin_user');
      if (credentials && credentials.password) {
        const user = JSON.parse(credentials.password);
        this.currentUser = user;
        return user;
      }
    } catch (error) {
      console.error('Failed to get stored user:', error);
    }

    return null;
  }

  async isSignedIn(): Promise<boolean> {
    if (this.useFallback) {
      return this.fallbackService.isSignedIn();
    }

    try {
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
      const isSignedIn = await (GoogleSignin as any).isSignedIn();
      return isSignedIn;
    } catch (error) {
      console.error('Failed to check sign-in status:', error);
      return false;
    }
  }

  private async storeUser(user: User): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        'ourcabin_user',
        user.id,
        JSON.stringify(user)
      );
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  }

  private async clearStoredUser(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials('ourcabin_user' as any);
    } catch (error) {
      console.error('Failed to clear stored user:', error);
    }
  }
}
