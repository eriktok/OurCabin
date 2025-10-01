import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Button } from '../components/ui/iOSButton';
import { Card } from '../components/ui/iOSCard';
import { SafeIcon } from '../components/ui/SafeIcon';
import { iOSDesignSystem } from '../theme/iOSDesignSystem';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

interface Props {
  onContinue: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onContinue }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome to OurCabin',
      subtitle: 'Your shared cabin experience starts here',
      description: 'Connect with family and friends to manage your shared cabin, coordinate visits, and create lasting memories together.',
      icon: 'home-heart',
      color: iOSDesignSystem.colors.primary,
    },
    {
      id: 2,
      title: 'Stay Organized',
      subtitle: 'Keep track of everything',
      description: 'Manage tasks, coordinate bookings, and stay on top of cabin maintenance with our intuitive task management system.',
      icon: 'check-circle',
      color: iOSDesignSystem.colors.success,
    },
    {
      id: 3,
      title: 'Share Memories',
      subtitle: 'Create lasting connections',
      description: 'Share photos, stories, and experiences with your cabin community. Build a digital scrapbook of your shared adventures.',
      icon: 'heart',
      color: iOSDesignSystem.colors.error,
    },
    {
      id: 4,
      title: 'Coordinate Visits',
      subtitle: 'Never double-book again',
      description: 'Plan your cabin stays with ease. See who\'s visiting when, request bookings, and avoid scheduling conflicts.',
      icon: 'calendar-check',
      color: iOSDesignSystem.colors.info,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onContinue();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onContinue();
  };

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <SafeIcon 
              name="home-heart" 
              size={48} 
              color={iOSDesignSystem.colors.primary} 
            />
          </View>
          <Text style={styles.appName}>OurCabin</Text>
          <Text style={styles.appTagline}>Your shared cabin experience</Text>
        </View>

        {/* Step Content */}
        <View style={styles.stepContainer}>
          <Card style={styles.stepCard}>
            <View style={styles.stepIconContainer}>
              <SafeIcon 
                name={currentStepData.icon} 
                size={64} 
                color={currentStepData.color} 
              />
            </View>
            
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
            <Text style={styles.stepDescription}>{currentStepData.description}</Text>
          </Card>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Card style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>What you can do:</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <SafeIcon name="post" size={20} color={iOSDesignSystem.colors.primary} />
                <Text style={styles.featureText}>Share updates and photos</Text>
              </View>
              <View style={styles.featureItem}>
                <SafeIcon name="check-circle" size={20} color={iOSDesignSystem.colors.success} />
                <Text style={styles.featureText}>Manage tasks and chores</Text>
              </View>
              <View style={styles.featureItem}>
                <SafeIcon name="calendar" size={20} color={iOSDesignSystem.colors.info} />
                <Text style={styles.featureText}>Coordinate cabin visits</Text>
              </View>
              <View style={styles.featureItem}>
                <SafeIcon name="account-group" size={20} color={iOSDesignSystem.colors.secondary} />
                <Text style={styles.featureText}>Invite family and friends</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.activeProgressDot,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {steps.length}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <Button
              title="Back"
              onPress={prevStep}
              variant="tertiary"
              style={styles.backButton}
            />
          )}
          
          <Button
            title={currentStep === steps.length - 1 ? "Get Started" : "Next"}
            onPress={nextStep}
            variant="primary"
            style={styles.nextButton}
            icon={currentStep === steps.length - 1 ? "arrow-right" : "chevron-right"}
            iconPosition="right"
          />
        </View>
        
        <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOSDesignSystem.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: iOSDesignSystem.spacing.xxxl,
    paddingBottom: iOSDesignSystem.spacing.xl,
    paddingHorizontal: iOSDesignSystem.spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: iOSDesignSystem.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: iOSDesignSystem.spacing.lg,
  },
  appName: {
    fontSize: iOSDesignSystem.typography.fontSize.largeTitle,
    fontWeight: iOSDesignSystem.typography.fontWeight.bold as any,
    color: iOSDesignSystem.colors.text.primary,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  appTagline: {
    fontSize: iOSDesignSystem.typography.fontSize.callout,
    color: iOSDesignSystem.colors.text.secondary,
    textAlign: 'center',
  },
  stepContainer: {
    paddingHorizontal: iOSDesignSystem.spacing.lg,
    marginBottom: iOSDesignSystem.spacing.xl,
  },
  stepCard: {
    alignItems: 'center',
    padding: iOSDesignSystem.spacing.xl,
  },
  stepIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: iOSDesignSystem.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: iOSDesignSystem.spacing.lg,
  },
  stepTitle: {
    fontSize: iOSDesignSystem.typography.fontSize.title1,
    fontWeight: iOSDesignSystem.typography.fontWeight.bold as any,
    color: iOSDesignSystem.colors.text.primary,
    textAlign: 'center',
    marginBottom: iOSDesignSystem.spacing.sm,
  },
  stepSubtitle: {
    fontSize: iOSDesignSystem.typography.fontSize.title3,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium as any,
    color: iOSDesignSystem.colors.text.secondary,
    textAlign: 'center',
    marginBottom: iOSDesignSystem.spacing.md,
  },
  stepDescription: {
    fontSize: iOSDesignSystem.typography.fontSize.body,
    color: iOSDesignSystem.colors.text.secondary,
    textAlign: 'center',
    lineHeight: iOSDesignSystem.typography.lineHeight.relaxed * iOSDesignSystem.typography.fontSize.body,
  },
  featuresContainer: {
    paddingHorizontal: iOSDesignSystem.spacing.lg,
    marginBottom: iOSDesignSystem.spacing.xl,
  },
  featuresCard: {
    padding: iOSDesignSystem.spacing.lg,
  },
  featuresTitle: {
    fontSize: iOSDesignSystem.typography.fontSize.headline,
    fontWeight: iOSDesignSystem.typography.fontWeight.semibold as any,
    color: iOSDesignSystem.colors.text.primary,
    marginBottom: iOSDesignSystem.spacing.md,
  },
  featuresList: {
    gap: iOSDesignSystem.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOSDesignSystem.spacing.md,
  },
  featureText: {
    fontSize: iOSDesignSystem.typography.fontSize.callout,
    color: iOSDesignSystem.colors.text.primary,
    flex: 1,
  },
  progressContainer: {
    alignItems: 'center',
    paddingHorizontal: iOSDesignSystem.spacing.lg,
    marginBottom: iOSDesignSystem.spacing.xl,
  },
  progressDots: {
    flexDirection: 'row',
    gap: iOSDesignSystem.spacing.sm,
    marginBottom: iOSDesignSystem.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: iOSDesignSystem.colors.fill.primary,
  },
  activeProgressDot: {
    backgroundColor: iOSDesignSystem.colors.primary,
  },
  progressText: {
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
    color: iOSDesignSystem.colors.text.tertiary,
  },
  bottomContainer: {
    paddingHorizontal: iOSDesignSystem.spacing.lg,
    paddingBottom: iOSDesignSystem.spacing.xl,
    backgroundColor: iOSDesignSystem.colors.background.primary,
    borderTopWidth: 0.5,
    borderTopColor: iOSDesignSystem.colors.separator.opaque,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: iOSDesignSystem.spacing.md,
    marginBottom: iOSDesignSystem.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: iOSDesignSystem.spacing.md,
  },
  skipText: {
    fontSize: iOSDesignSystem.typography.fontSize.callout,
    color: iOSDesignSystem.colors.text.secondary,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium as any,
  },
});
