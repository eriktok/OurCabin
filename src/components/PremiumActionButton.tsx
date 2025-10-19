import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface PremiumActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

export const PremiumActionButton: React.FC<PremiumActionButtonProps> = ({
  icon,
  label,
  onPress,
}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Surface style={styles.actionSurface} elevation={2}>
      <View style={styles.actionContent}>
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text variant="bodyMedium" style={styles.actionText}>
          {label}
        </Text>
      </View>
    </Surface>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionButton: {
    width: (width - 44) / 2,
  },
  actionSurface: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionContent: {
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
