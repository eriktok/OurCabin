import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Clipboard } from 'react-native';
import { useCabinApi } from '../services/ServiceProvider';
import { useAppStore } from '../stores/appStore';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  cabinId: string;
  onSignOut: () => void;
}

export const CabinSettingsScreen: React.FC<Props> = ({ cabinId, onSignOut }) => {
  const api = useCabinApi();
  const { selectedCabin } = useAppStore();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvite = async () => {
    setIsGenerating(true);
    try {
      const code = await api.generateInviteCode(cabinId);
      setInviteCode(code);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate invite code');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyInviteCode = async () => {
    if (inviteCode) {
      try {
        await Clipboard.setString(inviteCode);
        Alert.alert('Copied!', 'Invite code copied to clipboard');
      } catch (error) {
        Alert.alert('Error', 'Failed to copy invite code');
      }
    }
  };

  const shareInviteCode = () => {
    if (inviteCode) {
      Alert.alert(
        'Share Invite Code',
        `Share this code with friends: ${inviteCode}`,
        [
          { text: 'Copy', onPress: copyInviteCode },
          { text: 'Cancel' }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Cabin Settings" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.cabinInfo}>
            <Icon name="home" size={24} color="#2E7D32" />
            <View style={styles.cabinDetails}>
              <Text style={styles.cabinName}>{selectedCabin?.name || 'Cabin'}</Text>
              <Text style={styles.cabinId}>ID: {cabinId}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Icon name="account-plus" size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Invite Members</Text>
          </View>
          
          <Text style={styles.sectionDescription}>
            Generate an invite code to share with friends and family
          </Text>

          <PrimaryButton
            title={isGenerating ? "Generating..." : "Generate Invite Code"}
            onPress={generateInvite}
            loading={isGenerating}
            style={styles.generateButton}
          />

          {inviteCode && (
            <View style={styles.inviteSection}>
              <View style={styles.inviteCodeContainer}>
                <Text style={styles.inviteCodeLabel}>Invite Code</Text>
                <Text style={styles.inviteCode}>{inviteCode}</Text>
              </View>
              
              <View style={styles.inviteActions}>
                <TouchableOpacity style={styles.actionButton} onPress={copyInviteCode}>
                  <Icon name="content-copy" size={16} color="#2E7D32" />
                  <Text style={styles.actionButtonText}>Copy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={shareInviteCode}>
                  <Icon name="share" size={16} color="#2E7D32" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Icon name="cog" size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Cabin Settings</Text>
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="pencil" size={20} color="#666" />
              <Text style={styles.settingText}>Edit Cabin Name</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="account-group" size={20} color="#666" />
              <Text style={styles.settingText}>Manage Members</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="calendar" size={20} color="#666" />
              <Text style={styles.settingText}>Booking Rules</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Icon name="account" size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          
          <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
            <Icon name="logout" size={20} color="#fff" />
            <Text style={styles.signOutText}>Sign Out</Text>
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
  cabinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cabinDetails: {
    flex: 1,
  },
  cabinName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F2C',
    marginBottom: 4,
  },
  cabinId: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
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
    color: '#1A1F2C',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  generateButton: {
    marginBottom: 16,
  },
  inviteSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  inviteCodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteCodeLabel: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inviteCode: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2E7D32',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
