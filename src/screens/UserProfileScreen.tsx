import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useAppStore } from '../stores/appStore';
import { useCabinApi } from '../services/ServiceProvider';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { SafeIcon } from '../components/ui/SafeIcon';

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
      <AppHeader title="Profile" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {currentUser.photoUrl ? (
                <Image source={{ uri: currentUser.photoUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <SafeIcon name="account" size={32} color="#666" />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.displayName}>{currentUser.displayName}</Text>
              {currentUser.email && (
                <Text style={styles.email}>{currentUser.email}</Text>
              )}
              <View style={styles.memberSince}>
                <SafeIcon name="calendar" size={14} color="#666" />
                <Text style={styles.memberSinceText}>Member since 2024</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <SafeIcon name="home" size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Current Cabin</Text>
          </View>
          
          {selectedCabin ? (
            <View style={styles.cabinInfo}>
              <View style={styles.cabinDetails}>
                <Text style={styles.cabinName}>{selectedCabin.name}</Text>
                <Text style={styles.cabinId}>ID: {selectedCabin.id}</Text>
              </View>
              <SafeIcon name="home" size={24} color="#2E7D32" />
            </View>
          ) : (
            <View style={styles.noCabinContainer}>
              <SafeIcon name="home-outline" size={32} color="#ccc" />
              <Text style={styles.noCabinText}>No cabin selected</Text>
            </View>
          )}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <SafeIcon name="cog" size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
          >
            <View style={styles.settingInfo}>
              <SafeIcon name="pencil" size={20} color="#666" />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <SafeIcon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
          >
            <View style={styles.settingInfo}>
              <SafeIcon name="bell" size={20} color="#666" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <SafeIcon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon')}
          >
            <View style={styles.settingInfo}>
              <SafeIcon name="shield" size={20} color="#666" />
              <Text style={styles.settingText}>Privacy</Text>
            </View>
            <SafeIcon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => Alert.alert('Coming Soon', 'App preferences will be available soon')}
          >
            <View style={styles.settingInfo}>
              <SafeIcon name="tune" size={20} color="#666" />
              <Text style={styles.settingText}>Preferences</Text>
            </View>
            <SafeIcon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <SafeIcon name="help-circle" size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => Alert.alert('Coming Soon', 'Help center will be available soon')}
          >
            <View style={styles.settingInfo}>
              <SafeIcon name="help" size={20} color="#666" />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <SafeIcon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => Alert.alert('Coming Soon', 'Contact support will be available soon')}
          >
            <View style={styles.settingInfo}>
              <SafeIcon name="email" size={20} color="#666" />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <SafeIcon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity 
            style={[styles.signOutButton, isSigningOut && styles.signOutButtonDisabled]} 
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <SafeIcon name="logout" size={20} color="#fff" />
            <Text style={styles.signOutText}>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F8FA' 
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40 
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  displayName: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#1A1F2C', 
    marginBottom: 4 
  },
  email: { 
    fontSize: 16, 
    color: '#666',
    marginBottom: 8,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberSinceText: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1A1F2C' 
  },
  cabinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cabinDetails: {
    flex: 1,
  },
  cabinName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1A1F2C',
    marginBottom: 4,
  },
  cabinId: { 
    fontSize: 12, 
    color: '#666',
    fontFamily: 'monospace',
  },
  noCabinContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noCabinText: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 8,
  },
  settingItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: { 
    fontSize: 16, 
    color: '#1A1F2C',
    fontWeight: '500',
  },
  signOutButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F', 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  signOutButtonDisabled: { 
    backgroundColor: '#6c757d' 
  },
  signOutText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  errorText: { 
    fontSize: 16, 
    color: '#D32F2F', 
    textAlign: 'center', 
    marginTop: 50 
  },
});
