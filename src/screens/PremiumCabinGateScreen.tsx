import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Text, Surface, TextInput, Button, Chip, Avatar } from 'react-native-paper';
import { useCabinApi } from '../services/ServiceProvider';
import { Cabin } from '../core/models';

const { width } = Dimensions.get('window');

interface PremiumCabinGateScreenProps {
  userId: string;
  onCabinSelected: (cabin: Cabin) => void;
}

export const PremiumCabinGateScreen: React.FC<PremiumCabinGateScreenProps> = ({ 
  userId, 
  onCabinSelected 
}) => {
  const theme = useTheme();
  const api = useCabinApi();

  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [newCabinName, setNewCabinName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCabin, setIsCreatingCabin] = useState(false);
  const [isJoiningCabin, setIsJoiningCabin] = useState(false);
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadCabins();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [userId]);

  const loadCabins = async () => {
    setIsLoading(true);
    try {
      const userCabins = await api.listCabinsForUser(userId);
      setCabins(userCabins);
    } catch (error) {
      console.error('Failed to load cabins:', error);
      Alert.alert('Error', 'Failed to load cabins. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCabin = async () => {
    if (!newCabinName.trim()) {
      Alert.alert('Error', 'Cabin name cannot be empty.');
      return;
    }
    setIsCreatingCabin(true);
    try {
      const newCabin = await api.createCabin(newCabinName);
      setCabins((prev) => [...prev, newCabin]);
      onCabinSelected(newCabin);
      setNewCabinName('');
      Alert.alert('Success', `Cabin "${newCabin.name}" created!`);
    } catch (error) {
      console.error('Failed to create cabin:', error);
      Alert.alert('Error', 'Failed to create cabin. Please try again.');
    } finally {
      setIsCreatingCabin(false);
    }
  };

  const handleJoinCabin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Invite code cannot be empty.');
      return;
    }
    setIsJoiningCabin(true);
    try {
      const joinedCabin = await api.joinCabin(inviteCode);
      setCabins((prev) => [...prev, joinedCabin]);
      onCabinSelected(joinedCabin);
      setInviteCode('');
      Alert.alert('Success', `Joined cabin "${joinedCabin.name}"!`);
    } catch (error) {
      console.error('Failed to join cabin:', error);
      Alert.alert('Error', 'Failed to join cabin. Please check the invite code and try again.');
    } finally {
      setIsJoiningCabin(false);
    }
  };

  const CabinCard = ({ cabin }: { cabin: Cabin }) => (
    <Animated.View style={[styles.cabinCard, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={() => onCabinSelected(cabin)}>
        <Surface style={styles.cabinSurface} elevation={2}>
          <View style={[styles.cabinGradient, { backgroundColor: '#2E7D32' }]}>
            <View style={styles.cabinContent}>
              <View style={styles.cabinIconContainer}>
                <Text style={styles.cabinIcon}>🏠</Text>
              </View>
              <View style={styles.cabinTextContainer}>
                <Text variant="titleMedium" style={styles.cabinName}>
                  {cabin.name}
                </Text>
                <Text variant="bodySmall" style={styles.cabinSubtitle}>
                  Tap to enter
                </Text>
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading cabins...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome to OurCabin
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Choose your cabin or create a new one
          </Text>
        </View>

        {/* Existing Cabins */}
        {cabins.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Your Cabins
            </Text>
            <View style={styles.cabinsList}>
              {cabins.map((cabin) => (
                <CabinCard key={cabin.id} cabin={cabin} />
              ))}
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'join' && styles.activeTab]}
            onPress={() => setActiveTab('join')}
          >
            <Text style={[styles.tabText, activeTab === 'join' && styles.activeTabText]}>
              Join Cabin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'create' && styles.activeTab]}
            onPress={() => setActiveTab('create')}
          >
            <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
              Create Cabin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Join Cabin Form */}
        {activeTab === 'join' && (
          <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
            <Surface style={styles.formSurface} elevation={4}>
              <View style={styles.formContent}>
                <View style={styles.formHeader}>
                  <Text style={styles.formIcon}>🔑</Text>
                  <Text variant="headlineSmall" style={styles.formTitle}>
                    Join Existing Cabin
                  </Text>
                  <Text variant="bodyMedium" style={styles.formSubtitle}>
                    Enter the invite code shared by a family member
                  </Text>
                </View>

                <TextInput
                  label="Invite Code"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Enter invite code"
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleJoinCabin}
                  disabled={isJoiningCabin}
                >
                  <View style={[styles.submitGradient, { backgroundColor: '#2E7D32' }]}>
                    <Text style={styles.submitText}>
                      {isJoiningCabin ? 'Joining...' : 'Join Cabin'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Surface>
          </Animated.View>
        )}

        {/* Create Cabin Form */}
        {activeTab === 'create' && (
          <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
            <Surface style={styles.formSurface} elevation={4}>
              <View style={styles.formContent}>
                <View style={styles.formHeader}>
                  <Text style={styles.formIcon}>🏗️</Text>
                  <Text variant="headlineSmall" style={styles.formTitle}>
                    Create New Cabin
                  </Text>
                  <Text variant="bodyMedium" style={styles.formSubtitle}>
                    Set up a new cabin for your family
                  </Text>
                </View>

                <TextInput
                  label="Cabin Name"
                  value={newCabinName}
                  onChangeText={setNewCabinName}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Enter cabin name"
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleCreateCabin}
                  disabled={isCreatingCabin}
                >
                  <View style={[styles.submitGradient, { backgroundColor: '#FF6B35' }]}>
                    <Text style={styles.submitText}>
                      {isCreatingCabin ? 'Creating...' : 'Create Cabin'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Surface>
          </Animated.View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cabinsList: {
    gap: 12,
  },
  cabinCard: {
    marginBottom: 8,
  },
  cabinSurface: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cabinGradient: {
    padding: 20,
  },
  cabinContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cabinIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cabinIcon: {
    fontSize: 24,
  },
  cabinTextContainer: {
    flex: 1,
  },
  cabinName: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cabinSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chevronIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#2E7D32',
  },
  formCard: {
    marginBottom: 24,
  },
  formSurface: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
  },
  formContent: {
    alignItems: 'center',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  formIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  formTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    color: '#666',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
