import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import { User } from '../core/models';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initialize(): Promise<void> {
    try {
      GoogleSignin.configure({
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const user: User = {
        id: userInfo.user.id,
        displayName: userInfo.user.name || 'User',
        email: userInfo.user.email,
        photoUrl: userInfo.user.photo || null,
        createdAt: new Date().toISOString(),
      };

      // Store user in keychain
      await this.storeUser(user);
      this.currentUser = user;
      
      return user;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        throw new Error('Google sign-in failed: ' + error.message);
      }
    }
  }

  async signInWithVipps(): Promise<User> {
    // Vipps integration would go here
    // For now, return a mock user
    const user: User = {
      id: 'vipps-user-' + Date.now(),
      displayName: 'Vipps User',
      email: 'user@vipps.no',
      photoUrl: null,
      createdAt: new Date().toISOString(),
    };

    await this.storeUser(user);
    this.currentUser = user;
    return user;
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google sign-out error:', error);
    }

    await this.clearStoredUser();
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
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
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
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
      await Keychain.resetInternetCredentials('ourcabin_user');
    } catch (error) {
      console.error('Failed to clear stored user:', error);
    }
  }
}
