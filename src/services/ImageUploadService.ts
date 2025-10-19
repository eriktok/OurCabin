import { supabase } from '../config/supabase';
import { Platform } from 'react-native';

export class ImageUploadService {
  private static instance: ImageUploadService;

  static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  async uploadImage(
    imageUri: string, 
    bucketName: string = 'cabin-images',
    folder: string = 'posts'
  ): Promise<string> {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${folder}/${timestamp}-${randomId}.jpg`;

      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  async uploadMultipleImages(
    imageUris: string[],
    bucketName: string = 'cabin-images',
    folder: string = 'posts'
  ): Promise<string[]> {
    try {
      const uploadPromises = imageUris.map(uri => 
        this.uploadImage(uri, bucketName, folder)
      );
      
      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      console.error('Multiple image upload error:', error);
      throw new Error('Failed to upload images. Please try again.');
    }
  }

  async deleteImage(imageUrl: string, bucketName: string = 'cabin-images'): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folder = pathParts[pathParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Delete image error:', error);
        // Don't throw error for delete failures as it's not critical
      }
    } catch (error) {
      console.error('Delete image error:', error);
      // Don't throw error for delete failures as it's not critical
    }
  }

  async compressImage(imageUri: string, quality: number = 0.8): Promise<string> {
    // For now, return the original URI
    // In a real implementation, you would use a library like react-native-image-resizer
    return imageUri;
  }
}
