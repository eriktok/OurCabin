import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { MaterialScreen } from './MaterialScreen';
import { MaterialCard, MaterialButton, MaterialInput, MaterialFAB } from '../components/material';
import { useTheme } from 'react-native-paper';
import { Text, List, Avatar, Divider } from 'react-native-paper';
import { useCabinApi } from '../services/ServiceProvider';
import { Cabin } from '../core/models';

interface MaterialCabinGateScreenProps {
  userId: string;
  onCabinSelected: (cabin: Cabin) => void;
}

export const MaterialCabinGateScreen: React.FC<MaterialCabinGateScreenProps> = ({
  userId,
  onCabinSelected,
}) => {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newCabinName, setNewCabinName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const theme = useTheme();
  const api = useCabinApi();

  useEffect(() => {
    loadCabins();
  }, []);

  const loadCabins = async () => {
    try {
      setIsLoading(true);
      const userCabins = await api.listCabinsForUser(userId);
      setCabins(userCabins);
    } catch (error) {
      console.error('Failed to load cabins:', error);
      Alert.alert('Error', 'Failed to load your cabins. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCabin = async () => {
    if (!newCabinName.trim()) {
      Alert.alert('Error', 'Please enter a cabin name');
      return;
    }

    try {
      const newCabin = await api.createCabin(newCabinName.trim());
      setCabins([newCabin, ...cabins]);
      setNewCabinName('');
      setShowCreateModal(false);
      onCabinSelected(newCabin);
    } catch (error) {
      console.error('Failed to create cabin:', error);
      Alert.alert('Error', 'Failed to create cabin. Please try again.');
    }
  };

  const handleJoinCabin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    try {
      const cabin = await api.joinCabin(inviteCode.trim());
      setCabins([cabin, ...cabins]);
      setInviteCode('');
      setShowJoinModal(false);
      onCabinSelected(cabin);
    } catch (error) {
      console.error('Failed to join cabin:', error);
      Alert.alert('Error', 'Invalid invite code. Please check and try again.');
    }
  };

  const handleCabinSelect = (cabin: Cabin) => {
    onCabinSelected(cabin);
  };

  if (isLoading) {
    return (
      <MaterialScreen title="Loading Cabins..." scrollable={false}>
        <View style={styles.loadingContainer}>
          <Text>Loading your cabins...</Text>
        </View>
      </MaterialScreen>
    );
  }

  return (
    <MaterialScreen
      title="Select Cabin"
      subtitle="Choose or create a cabin to continue"
      fab={{
        icon: 'plus',
        onPress: () => setShowCreateModal(true),
        label: 'Create Cabin',
      }}
    >
      <View style={styles.container}>
        {cabins.length === 0 ? (
          <MaterialCard variant="elevated" style={styles.emptyCard}>
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              🏠 No Cabins Yet
            </Text>
            <Text variant="bodyLarge" style={styles.emptySubtitle}>
              Create your first cabin or join an existing one with an invite code.
            </Text>
            <View style={styles.emptyActions}>
              <MaterialButton
                variant="primary"
                onPress={() => setShowCreateModal(true)}
                style={styles.emptyButton}
              >
                Create Cabin
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                onPress={() => setShowJoinModal(true)}
                style={styles.emptyButton}
              >
                Join Cabin
              </MaterialButton>
            </View>
          </MaterialCard>
        ) : (
          <MaterialCard variant="elevated" style={styles.cabinsCard}>
            <Text variant="titleLarge" style={styles.cabinsTitle}>
              Your Cabins
            </Text>
            <List.Section>
              {cabins.map((cabin) => (
                <List.Item
                  key={cabin.id}
                  title={cabin.name}
                  description="Tap to enter"
                  left={(props) => <Avatar.Icon {...props} icon="home" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => handleCabinSelect(cabin)}
                  style={styles.cabinItem}
                />
              ))}
            </List.Section>
            
            <Divider style={styles.divider} />
            
            <View style={styles.joinActions}>
              <MaterialButton
                variant="outlined"
                onPress={() => setShowJoinModal(true)}
                style={styles.joinButton}
              >
                Join Another Cabin
              </MaterialButton>
            </View>
          </MaterialCard>
        )}

        {/* Create Cabin Modal */}
        {showCreateModal && (
          <View style={styles.modalOverlay}>
            <MaterialCard variant="elevated" style={styles.modalCard}>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Create New Cabin
              </Text>
              <MaterialInput
                label="Cabin Name"
                placeholder="Enter cabin name"
                value={newCabinName}
                onChangeText={setNewCabinName}
                style={styles.modalInput}
              />
              <View style={styles.modalActions}>
                <MaterialButton
                  variant="outlined"
                  onPress={() => setShowCreateModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </MaterialButton>
                <MaterialButton
                  variant="primary"
                  onPress={handleCreateCabin}
                  style={styles.modalButton}
                >
                  Create
                </MaterialButton>
              </View>
            </MaterialCard>
          </View>
        )}

        {/* Join Cabin Modal */}
        {showJoinModal && (
          <View style={styles.modalOverlay}>
            <MaterialCard variant="elevated" style={styles.modalCard}>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Join Cabin
              </Text>
              <MaterialInput
                label="Invite Code"
                placeholder="Enter invite code"
                value={inviteCode}
                onChangeText={setInviteCode}
                style={styles.modalInput}
              />
              <View style={styles.modalActions}>
                <MaterialButton
                  variant="outlined"
                  onPress={() => setShowJoinModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </MaterialButton>
                <MaterialButton
                  variant="primary"
                  onPress={handleJoinCabin}
                  style={styles.modalButton}
                >
                  Join
                </MaterialButton>
              </View>
            </MaterialCard>
          </View>
        )}
      </View>
    </MaterialScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  emptyActions: {
    gap: 12,
  },
  emptyButton: {
    marginVertical: 4,
  },
  cabinsCard: {
    marginBottom: 16,
  },
  cabinsTitle: {
    marginBottom: 16,
  },
  cabinItem: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  joinActions: {
    alignItems: 'center',
  },
  joinButton: {
    minWidth: 200,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
