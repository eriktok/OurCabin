import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  onContinue: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onContinue }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Cabin</Text>
      <Text style={styles.subtitle}>Simplify shared cabin life</Text>
      <View style={styles.actions}>
        <Button title="Continue" onPress={onContinue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.7 },
  actions: { marginTop: 24, width: '60%' },
});


