import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native';

interface AppHeaderProps {
  title: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, right, left }) => {
  return (
    <View style={styles.container}>
      <View style={styles.side}>{left}</View>
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
});
