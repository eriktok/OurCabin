import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { PrimaryButton } from './ui/PrimaryButton';
import { SafeIcon } from './ui/SafeIcon';
import { useAppStore } from '../stores/appStore';
import { User } from '../core/models';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, onSave }) => {
  const { currentUser } = useAppStore();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser: Partial<User> = {
        displayName: displayName.trim(),
        email: email.trim() || currentUser?.email,
      };

      await onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setDisplayName(currentUser?.displayName || '');
    setEmail(currentUser?.email || '');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <PrimaryButton
            title="Save"
            onPress={handleSave}
            loading={isSaving}
            style={styles.saveButton}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
              maxLength={50}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
            <Text style={styles.helpText}>
              Email cannot be changed. Contact support if you need to update your email.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Profile Picture</Text>
            <TouchableOpacity style={styles.photoButton}>
              <SafeIcon name="camera" size={24} color="#666" />
              <Text style={styles.photoButtonText}>Change Photo</Text>
            </TouchableOpacity>
            <Text style={styles.helpText}>
              Profile pictures are managed through your Google account.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F2C',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1F2C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 16,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
