import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { MaterialScreen } from './MaterialScreen';
import { MaterialCard, MaterialButton, MaterialInput, MaterialLoading } from '../components/material';
import { useTheme } from 'react-native-paper';
import { Text, Divider } from 'react-native-paper';
import { SimpleAuthService } from '../services/SimpleAuthService';

interface MaterialAuthScreenProps {
  onSignedIn: (user: any) => void;
}

export const MaterialAuthScreen: React.FC<MaterialAuthScreenProps> = ({ onSignedIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const theme = useTheme();
  const authService = SimpleAuthService.getInstance();

  React.useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await authService.initialize();
      const user = await authService.getCurrentUser();
      if (user) {
        onSignedIn(user);
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
      onSignedIn(user);
    } catch (error: any) {
      console.error('Vipps sign-in error:', error);
      Alert.alert('Sign-in Failed', error.message || 'Unable to sign in with Vipps. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <MaterialLoading message="Initializing authentication..." />;
  }

  return (
    <MaterialScreen
      title="Welcome to OurCabin"
      subtitle="Sign in to access your cabin"
      scrollable={false}
    >
      <View style={styles.container}>
        <MaterialCard variant="elevated" style={styles.welcomeCard}>
          <Text variant="headlineSmall" style={styles.welcomeTitle}>
            🏠 Welcome to OurCabin
          </Text>
          <Text variant="bodyLarge" style={styles.welcomeSubtitle}>
            Your shared cabin experience starts here. Connect with family and friends to manage your shared cabin.
          </Text>
        </MaterialCard>

        <MaterialCard variant="outlined" style={styles.authCard}>
          <Text variant="titleLarge" style={styles.authTitle}>
            Sign In
          </Text>
          
          <MaterialButton
            variant="primary"
            size="large"
            fullWidth
            onPress={handleGoogleSignIn}
            loading={isLoading}
            disabled={isLoading}
            style={styles.signInButton}
          >
            Continue with Google
          </MaterialButton>

          <Divider style={styles.divider} />

          <MaterialButton
            variant="outlined"
            size="large"
            fullWidth
            onPress={handleVippsSignIn}
            loading={isLoading}
            disabled={isLoading}
            style={styles.signInButton}
          >
            Continue with Vipps
          </MaterialButton>

          <Text variant="bodySmall" style={styles.termsText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </MaterialCard>

        <MaterialCard variant="filled" style={styles.featuresCard}>
          <Text variant="titleMedium" style={styles.featuresTitle}>
            What you can do:
          </Text>
          <View style={styles.featureList}>
            <Text variant="bodyMedium" style={styles.featureItem}>
              📝 Share updates in the logbook
            </Text>
            <Text variant="bodyMedium" style={styles.featureItem}>
              ✅ Manage tasks and maintenance
            </Text>
            <Text variant="bodyMedium" style={styles.featureItem}>
              📅 Coordinate cabin bookings
            </Text>
            <Text variant="bodyMedium" style={styles.featureItem}>
              👨‍👩‍👧‍👦 Connect with family members
            </Text>
          </View>
        </MaterialCard>
      </View>
    </MaterialScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  authCard: {
    marginBottom: 16,
  },
  authTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    marginVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  termsText: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  featuresCard: {
    marginBottom: 16,
  },
  featuresTitle: {
    marginBottom: 12,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    marginBottom: 4,
  },
});
