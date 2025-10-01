import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { PrimaryButton } from './ui/PrimaryButton';
import { SafeIcon } from './ui/SafeIcon';
import { ImageUploadService } from '../services/ImageUploadService';

interface PostComposerModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, imageUri?: string) => void;
}

export const PostComposerModal: React.FC<PostComposerModalProps> = ({ visible, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageUploadService = ImageUploadService.getInstance();

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri || null);
      }
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageUrl: string | undefined;
      
      if (imageUri) {
        setIsUploading(true);
        try {
          uploadedImageUrl = await imageUploadService.uploadImage(imageUri);
        } catch (error) {
          console.error('Image upload error:', error);
          Alert.alert('Upload Failed', 'Failed to upload image. Post will be created without image.');
        } finally {
          setIsUploading(false);
        }
      }

      await onSubmit(content.trim(), uploadedImageUrl);
      setContent('');
      setImageUri(null);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setImageUri(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Post</Text>
          <PrimaryButton
            title={isUploading ? "Uploading..." : "Post"}
            onPress={handleSubmit}
            loading={isSubmitting || isUploading}
            style={styles.postButton}
          />
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.textInput}
            placeholder="What's happening at the cabin?"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
              >
                <SafeIcon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleImagePicker}>
              <SafeIcon name="image" size={24} color="#2E7D32" />
              <Text style={styles.actionText}>Photo</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.characterCount}>{content.length}/500</Text>
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
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#1A1F2C',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  characterCount: {
    textAlign: 'right',
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
});
