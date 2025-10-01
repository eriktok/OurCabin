import { User } from '../core/models';
import * as Keychain from 'react-native-keychain';

export class FallbackAuthService {
  private static instance: FallbackAuthService;
  private currentUser: User | null = null;

  static getInstance(): FallbackAuthService {
    if (!FallbackAuthService.instance) {
      FallbackAuthService.instance = new FallbackAuthService();
    }
    return FallbackAuthService.instance;
  }

  async initialize(): Promise<void> {
    console.log('Using fallback authentication service');
  }

  async signInWithGoogle(): Promise<User> {
    // Simulate Google sign-in with a demo user
    const user: User = {
      id: 'demo-google-user-' + Date.now(),
      displayName: 'Demo Google User',
      email: 'demo@google.com',
      photoUrl: null,
      createdAt: new Date().toISOString(),
    };

    await this.storeUser(user);
    this.currentUser = user;
    return user;
  }

  async signInWithVipps(): Promise<User> {
    // Simulate Vipps sign-in with a demo user
    const user: User = {
      id: 'demo-vipps-user-' + Date.now(),
      displayName: 'Demo Vipps User',
      email: 'demo@vipps.no',
      photoUrl: null,
      createdAt: new Date().toISOString(),
    };

    await this.storeUser(user);
    this.currentUser = user;
    return user;
  }

  async signOut(): Promise<void> {
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
    const user = await this.getCurrentUser();
    return user !== null;
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
