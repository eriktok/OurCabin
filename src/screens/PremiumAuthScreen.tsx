import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Text, Surface, Button, Divider } from 'react-native-paper';
import { SimpleAuthService } from '../services/SimpleAuthService';

const { width, height } = Dimensions.get('window');

interface PremiumAuthScreenProps {
  onSignedIn: (user: any) => void;
}

export const PremiumAuthScreen: React.FC<PremiumAuthScreenProps> = ({ onSignedIn }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const authService = SimpleAuthService.getInstance();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      onSignedIn(user);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.backgroundGradient}>
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🏠</Text>
            </View>
            <Text variant="headlineLarge" style={styles.appTitle}>
              OurCabin
            </Text>
            <Text variant="bodyLarge" style={styles.appSubtitle}>
              Connect with your family and manage your shared cabin
            </Text>
          </View>

          {/* Auth Cards */}
          <View style={styles.authCards}>
            <Surface style={styles.authCard} elevation={4}>
              <View style={styles.authContent}>
                <Text variant="headlineSmall" style={styles.welcomeTitle}>
                  Welcome Back
                </Text>
                <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
                  Sign in to continue to your cabin
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <View style={[styles.buttonGradient, { backgroundColor: '#4285F4' }]}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonIcon}>🔍</Text>
                        <Text style={styles.buttonText}>
                          {isLoading ? 'Signing in...' : 'Continue with Google'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.vippsButton}
                    onPress={handleVippsSignIn}
                    disabled={isLoading}
                  >
                    <View style={[styles.buttonGradient, { backgroundColor: '#FF6B35' }]}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonIcon}>💳</Text>
                        <Text style={styles.buttonText}>
                          {isLoading ? 'Signing in...' : 'Continue with Vipps'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.dividerContainer}>
                  <Divider style={styles.divider} />
                  <Text variant="bodySmall" style={styles.dividerText}>
                    or
                  </Text>
                  <Divider style={styles.divider} />
                </View>

                <Text variant="bodySmall" style={styles.privacyText}>
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </Text>
              </View>
            </Surface>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text variant="bodyMedium" style={styles.featuresTitle}>
              What you can do with OurCabin
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📝</Text>
                <Text variant="bodySmall" style={styles.featureText}>
                  Share cabin updates
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📅</Text>
                <Text variant="bodySmall" style={styles.featureText}>
                  Book your stay
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>👥</Text>
                <Text variant="bodySmall" style={styles.featureText}>
                  Connect with family
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  appTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  authCards: {
    flex: 1,
    justifyContent: 'center',
  },
  authCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  blurContainer: {
    padding: 32,
  },
  authContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  googleButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  vippsButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  divider: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  privacyText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  featuresTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 12,
  },
});
