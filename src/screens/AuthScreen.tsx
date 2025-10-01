import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useCabinApi } from '../services/ServiceProvider';

interface Props {
  onSignedIn: () => void;
}

export const AuthScreen: React.FC<Props> = ({ onSignedIn }) => {
  const api = useCabinApi();

  const signInGoogle = async () => {
    await api.signInWithGoogle();
    onSignedIn();
  };
  const signInVipps = async () => {
    await api.signInWithVipps();
    onSignedIn();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <View style={styles.actions}>
        <Button title="Continue with Google" onPress={signInGoogle} />
      </View>
      <View style={styles.actions}>
        <Button title="Continue with Vipps" onPress={signInVipps} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  actions: { width: '70%', marginVertical: 6 },
});


