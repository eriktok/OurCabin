import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafeIcon } from '../components/ui/SafeIcon';
import { CabinSettingsService } from '../services/CabinSettingsService';
import { CabinSettings, CabinMember, CabinInvite } from '../core/models/CabinSettings';

interface Props {
  cabinId: string;
  onBack: () => void;
}

export const CabinSettingsAdvancedScreen: React.FC<Props> = ({ cabinId, onBack }) => {
  const [settings, setSettings] = useState<CabinSettings | null>(null);
  const [members, setMembers] = useState<CabinMember[]>([]);
  const [invites, setInvites] = useState<CabinInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'members' | 'invites'>('settings');
  
  const settingsService = CabinSettingsService.getInstance();

  useEffect(() => {
    loadData();
  }, [cabinId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsData, membersData, invitesData] = await Promise.all([
        settingsService.getCabinSettings(cabinId),
        settingsService.getCabinMembers(cabinId),
        settingsService.getCabinInvites(cabinId),
      ]);
      
      setSettings(settingsData);
      setMembers(membersData);
      setInvites(invitesData);
    } catch (error) {
      console.error('Failed to load cabin data:', error);
      Alert.alert('Error', 'Failed to load cabin settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      await settingsService.updateCabinSettings(cabinId, settings);
      Alert.alert('Success', 'Cabin settings updated successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const createInvite = async () => {
    try {
      const newInvite = await settingsService.createCabinInvite(cabinId, 7, 5);
      setInvites(prev => [newInvite, ...prev]);
      Alert.alert('Success', `Invite code created: ${newInvite.code}`);
    } catch (error) {
      console.error('Failed to create invite:', error);
      Alert.alert('Error', 'Failed to create invite. Please try again.');
    }
  };

  const deactivateInvite = async (inviteId: string) => {
    try {
      await settingsService.deactivateInvite(inviteId);
      setInvites(prev => prev.filter(invite => invite.id !== inviteId));
      Alert.alert('Success', 'Invite deactivated successfully!');
    } catch (error) {
      console.error('Failed to deactivate invite:', error);
      Alert.alert('Error', 'Failed to deactivate invite. Please try again.');
    }
  };

  const updateSetting = (path: string, value: any) => {
    if (!settings) return;
    
    const newSettings = { ...settings };
    const keys = path.split('.');
    let current = newSettings as any;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Cabin Settings" onBack={onBack} />
        <View style={styles.loadingContainer}>
          <Text>Loading cabin settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Cabin Settings" onBack={onBack} />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <SafeIcon name="cog" size={20} color={activeTab === 'settings' ? '#2E7D32' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => setActiveTab('members')}
        >
          <SafeIcon name="account-group" size={20} color={activeTab === 'members' ? '#2E7D32' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
            Members
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'invites' && styles.activeTab]}
          onPress={() => setActiveTab('invites')}
        >
          <SafeIcon name="account-plus" size={20} color={activeTab === 'invites' ? '#2E7D32' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
            Invites
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'settings' && settings && (
          <View>
            {/* Booking Settings */}
            <Card>
              <Text style={styles.sectionTitle}>📅 Booking Settings</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Advance Booking Days</Text>
                <Text style={styles.settingValue}>{settings.bookingSettings.advanceBookingDays} days</Text>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Max Booking Duration</Text>
                <Text style={styles.settingValue}>{settings.bookingSettings.maxBookingDuration} days</Text>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Require Approval</Text>
                <Switch
                  value={settings.bookingSettings.requireApproval}
                  onValueChange={(value) => updateSetting('bookingSettings.requireApproval', value)}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Auto-approve Members</Text>
                <Switch
                  value={settings.bookingSettings.autoApproveMembers}
                  onValueChange={(value) => updateSetting('bookingSettings.autoApproveMembers', value)}
                />
              </View>
            </Card>

            {/* Task Settings */}
            <Card>
              <Text style={styles.sectionTitle}>✅ Task Settings</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Allow Task Assignment</Text>
                <Switch
                  value={settings.taskSettings.allowTaskAssignment}
                  onValueChange={(value) => updateSetting('taskSettings.allowTaskAssignment', value)}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Require Task Approval</Text>
                <Switch
                  value={settings.taskSettings.requireTaskApproval}
                  onValueChange={(value) => updateSetting('taskSettings.requireTaskApproval', value)}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Auto-archive Completed</Text>
                <Switch
                  value={settings.taskSettings.autoArchiveCompleted}
                  onValueChange={(value) => updateSetting('taskSettings.autoArchiveCompleted', value)}
                />
              </View>
            </Card>

            {/* Notification Settings */}
            <Card>
              <Text style={styles.sectionTitle}>🔔 Notification Settings</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Notify on New Posts</Text>
                <Switch
                  value={settings.notificationSettings.notifyOnNewPosts}
                  onValueChange={(value) => updateSetting('notificationSettings.notifyOnNewPosts', value)}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Notify on New Tasks</Text>
                <Switch
                  value={settings.notificationSettings.notifyOnNewTasks}
                  onValueChange={(value) => updateSetting('notificationSettings.notifyOnNewTasks', value)}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Notify on Booking Requests</Text>
                <Switch
                  value={settings.notificationSettings.notifyOnBookingRequests}
                  onValueChange={(value) => updateSetting('notificationSettings.notifyOnBookingRequests', value)}
                />
              </View>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <Text style={styles.sectionTitle}>🔒 Privacy Settings</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Show Member List</Text>
                <Switch
                  value={settings.privacySettings.showMemberList}
                  onValueChange={(value) => updateSetting('privacySettings.showMemberList', value)}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Allow Guest Posts</Text>
                <Switch
                  value={settings.privacySettings.allowGuestPosts}
                  onValueChange={(value) => updateSetting('privacySettings.allowGuestPosts', value)}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Show Booking History</Text>
                <Switch
                  value={settings.privacySettings.showBookingHistory}
                  onValueChange={(value) => updateSetting('privacySettings.showBookingHistory', value)}
                />
              </View>
            </Card>

            <PrimaryButton
              title={saving ? "Saving..." : "Save Settings"}
              onPress={saveSettings}
              loading={saving}
              style={styles.saveButton}
            />
          </View>
        )}

        {activeTab === 'members' && (
          <View>
            <Card>
              <Text style={styles.sectionTitle}>👥 Cabin Members ({members.length})</Text>
              {members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>User {member.userId}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <View style={styles.memberActions}>
                    <SafeIcon name="chevron-right" size={20} color="#666" />
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}

        {activeTab === 'invites' && (
          <View>
            <Card>
              <Text style={styles.sectionTitle}>📨 Active Invites</Text>
              {invites.length === 0 ? (
                <Text style={styles.emptyText}>No active invites</Text>
              ) : (
                invites.map((invite) => (
                  <View key={invite.id} style={styles.inviteRow}>
                    <View style={styles.inviteInfo}>
                      <Text style={styles.inviteCode}>{invite.code}</Text>
                      <Text style={styles.inviteDetails}>
                        Used: {invite.usedCount}/{invite.maxUses || '∞'} • 
                        Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deactivateButton}
                      onPress={() => deactivateInvite(invite.id)}
                    >
                      <SafeIcon name="close" size={16} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </Card>

            <PrimaryButton
              title="Create New Invite"
              onPress={createInvite}
              style={styles.createButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#2E7D32',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F2C',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1A1F2C',
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 24,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1F2C',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  memberActions: {
    paddingLeft: 16,
  },
  inviteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  inviteInfo: {
    flex: 1,
  },
  inviteCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  inviteDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deactivateButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FFEBEE',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  createButton: {
    marginTop: 16,
  },
});
