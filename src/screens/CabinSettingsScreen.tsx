import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useCabinApi } from '../services/ServiceProvider';

interface Props {
  cabinId: string;
  onSignOut: () => void;
}

export const CabinSettingsScreen: React.FC<Props> = ({ cabinId, onSignOut }) => {
  const api = useCabinApi();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const generateInvite = async () => {
    const code = await api.generateInviteCode(cabinId);
    setInviteCode(code);
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      Alert.alert('Invite Code', `Share this code: ${inviteCode}`, [
        { text: 'Copy', onPress: () => console.log('Copied:', inviteCode) },
        { text: 'Cancel' }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cabin Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invite Members</Text>
        <Button title="Generate Invite Code" onPress={generateInvite} />
        {inviteCode && (
          <View style={styles.inviteSection}>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyInviteCode}>
              <Text style={styles.copyButtonText}>Copy & Share</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Button title="Sign Out" onPress={onSignOut} color="#ff4444" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  inviteSection: { marginTop: 12, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
  inviteCode: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 8, fontFamily: 'monospace' },
  copyButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 6, alignItems: 'center' },
  copyButtonText: { color: 'white', fontWeight: '600' },
});
