import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useCabinApi } from '../services/ServiceProvider';
import { useAppStore } from '../stores/appStore';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafeIcon } from '../components/ui/SafeIcon';
import { SimpleAuthService } from '../services/SimpleAuthService';
import { User } from '../core/models';

interface Props {
  onSignedIn: (user: User) => void;
}

export const AuthScreen: React.FC<Props> = ({ onSignedIn }) => {
  const api = useCabinApi();
  const { setCurrentUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const authService = SimpleAuthService.getInstance();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await authService.initialize();
      
      // Check if user is already signed in
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        onSignedIn();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      setCurrentUser(user);
      onSignedIn(user);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      Alert.alert('Sign-in Failed', error.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVippsSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithVipps();
      setCurrentUser(user);
      onSignedIn(user);
    } catch (error: any) {
      console.error('Vipps sign-in error:', error);
      Alert.alert('Sign-in Failed', error.message || 'Unable to sign in with Vipps. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Welcome to OurCabin" />
      
      <View style={styles.content}>
        <Card>
          <View style={styles.welcomeSection}>
            <SafeIcon name="home" size={64} color="#2E7D32" />
            <Text style={styles.welcomeTitle}>Welcome to OurCabin</Text>
            <Text style={styles.welcomeSubtitle}>
              Connect with your cabin community and share memories together
            </Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.signInTitle}>Sign in to continue</Text>
          
          <PrimaryButton
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            loading={isLoading}
            style={[styles.signInButton, styles.googleButton]}
            icon={<SafeIcon name="google" size={20} color="#fff" />}
          />

          <TouchableOpacity
            style={[styles.signInButton, styles.vippsButton]}
            onPress={handleVippsSignIn}
            disabled={isLoading}
          >
            <SafeIcon name="phone" size={20} color="#fff" />
            <Text style={styles.signInButtonText}>
              {isLoading ? 'Signing in...' : 'Continue with Vipps'}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.privacyText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F8FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1F2C',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  signInTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1F2C',
    marginBottom: 20,
    textAlign: 'center',
  },
  signInButton: {
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  vippsButton: {
    backgroundColor: '#5B2C6F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});


