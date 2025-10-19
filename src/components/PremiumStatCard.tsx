import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Animated } from 'react-native';

const { width } = Dimensions.get('window');

interface PremiumStatCardProps {
  title: string;
  value: number;
  icon: string;
  gradient: [string, string];
  opacity: Animated.Value;
}

export const PremiumStatCard: React.FC<PremiumStatCardProps> = ({
  title,
  value,
  icon,
  gradient,
  opacity,
}) => (
  <Animated.View style={[styles.statCard, { opacity }]}>
    <Surface style={[styles.statSurface, { backgroundColor: gradient[0] }]} elevation={2}>
      <View style={styles.statContent}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <View style={styles.statTextContainer}>
          <Text variant="headlineMedium" style={styles.statValue}>
            {value}
          </Text>
          <Text variant="bodyMedium" style={styles.statTitle}>
            {title}
          </Text>
        </View>
      </View>
    </Surface>
  </Animated.View>
);

const styles = StyleSheet.create({
  statCard: {
    width: (width - 44) / 2,
  },
  statSurface: {
    borderRadius: 16,
    padding: 20,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 24,
    color: 'white',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  statTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
});
