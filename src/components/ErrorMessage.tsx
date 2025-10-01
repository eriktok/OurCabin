import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage: React.FC<Props> = ({ 
  message, 
  onRetry, 
  retryText = 'Retry' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button title={retryText} onPress={onRetry} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
});
