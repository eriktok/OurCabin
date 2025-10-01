import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, loading, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={!!loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.label}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: '700',
  },
});
