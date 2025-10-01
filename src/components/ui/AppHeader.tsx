import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { SafeIcon } from './SafeIcon';

interface AppHeaderProps {
  title: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  onBack?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, right, left, onBack }) => {
  const leftContent = onBack ? (
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <SafeIcon name="chevron-left" size={24} color="#007AFF" />
    </TouchableOpacity>
  ) : left;

  return (
    <View style={styles.container}>
      <View style={styles.side}>{leftContent}</View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  side: { width: 48, alignItems: 'center' },
  backButton: {
    padding: 8,
  },
});
