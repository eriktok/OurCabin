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
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    marginBottom: 24,
    color: '#2c3e50',
    textAlign: 'center',
  },
  actions: { 
    width: '80%', 
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});


