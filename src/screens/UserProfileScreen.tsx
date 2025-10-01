import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useAppStore } from '../stores/appStore';
import { useCabinApi } from '../services/ServiceProvider';

export const UserProfileScreen: React.FC = () => {
  const { currentUser, selectedCabin, setCurrentUser } = useAppStore();
  const api = useCabinApi();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              await api.signOut();
              setCurrentUser(null);
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {currentUser.photoUrl && (
          <Image source={{ uri: currentUser.photoUrl }} style={styles.avatar} />
        )}
        <Text style={styles.displayName}>{currentUser.displayName}</Text>
        {currentUser.email && (
          <Text style={styles.email}>{currentUser.email}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Cabin</Text>
        {selectedCabin ? (
          <View style={styles.cabinInfo}>
            <Text style={styles.cabinName}>{selectedCabin.name}</Text>
            <Text style={styles.cabinId}>ID: {selectedCabin.id}</Text>
          </View>
        ) : (
          <Text style={styles.noCabinText}>No cabin selected</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}>
          <Text style={styles.settingText}>Edit Profile</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}>
          <Text style={styles.settingText}>Notifications</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon')}>
          <Text style={styles.settingText}>Privacy</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.signOutButton, isSigningOut && styles.signOutButtonDisabled]} 
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          <Text style={styles.signOutText}>
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  profileCard: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 12, 
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  displayName: { fontSize: 24, fontWeight: '700', color: '#2c3e50', marginBottom: 4 },
  email: { fontSize: 16, color: '#6c757d' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginBottom: 12 },
  cabinInfo: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cabinName: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  cabinId: { fontSize: 12, color: '#6c757d', marginTop: 4 },
  noCabinText: { fontSize: 16, color: '#6c757d', fontStyle: 'italic' },
  settingItem: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingText: { fontSize: 16, color: '#2c3e50' },
  settingArrow: { fontSize: 20, color: '#6c757d' },
  signOutButton: { 
    backgroundColor: '#dc3545', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonDisabled: { backgroundColor: '#6c757d' },
  signOutText: { color: 'white', fontSize: 16, fontWeight: '600' },
  errorText: { fontSize: 16, color: '#dc3545', textAlign: 'center', marginTop: 50 },
});
