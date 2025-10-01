import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Post } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useAsync } from '../hooks/useAsync';
import { ErrorHandler } from '../utils/errorHandler';

export const LogbookScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const api = useCabinApi();
  const { loading, error, execute } = useAsync<Post[]>();

  useEffect(() => {
    execute(() => api.getPosts('demo-cabin', 20))
      .then(setPosts)
      .catch((err) => {
        ErrorHandler.showAlert(ErrorHandler.handle(err));
      });
  }, [api, execute]);

  const pickImages = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      selectionLimit: 3,
    };
    
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.assets && response.assets.length > 0) {
        const imageUris = response.assets.map(asset => asset.uri!).filter(Boolean);
        setSelectedImages(prev => [...prev, ...imageUris].slice(0, 3));
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!text.trim() && selectedImages.length === 0) return;
    
    try {
      const created = await api.createPost('demo-cabin', { 
        text, 
        imageUrls: selectedImages 
      });
      setPosts((p) => [created, ...p]);
      setText('');
      setSelectedImages([]);
    } catch (err) {
      ErrorHandler.showAlert(ErrorHandler.handle(err));
    }
  };

  if (loading && posts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load posts</Text>
        <Button title="Retry" onPress={() => {
          execute(() => api.getPosts('demo-cabin', 20))
            .then(setPosts)
            .catch((err) => ErrorHandler.showAlert(ErrorHandler.handle(err)));
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Write a post..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <Button title="📷" onPress={pickImages} />
        <Button title="Post" onPress={submit} />
      </View>
      
      {selectedImages.length > 0 && (
        <View style={styles.imagePreview}>
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImageBtn} 
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>{item.text}</Text>
            {item.imageUrls && item.imageUrls.length > 0 && (
              <View style={styles.postImages}>
                {item.imageUrls.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.postImage} />
                ))}
              </View>
            )}
            <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={async () => {
                  await api.likePost(item.id);
                  setPosts((prev) => prev.map((p) => (p.id === item.id ? { ...p, likes: (p.likes ?? 0) + 1 } : p)));
                }}
                style={styles.likeBtn}
              >
                <Text>❤️ {item.likes ?? 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  composer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 16, 
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#e9ecef', 
    borderRadius: 8, 
    padding: 12, 
    minHeight: 40,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  list: { gap: 12 },
  post: { 
    padding: 16, 
    borderRadius: 12, 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postText: { fontSize: 16, lineHeight: 24, color: '#2c3e50' },
  meta: { fontSize: 12, color: '#6c757d', marginTop: 8, fontWeight: '500' },
  row: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 12 },
  likeBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderWidth: 1, 
    borderColor: '#e9ecef', 
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  imagePreview: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  imageContainer: { position: 'relative' },
  previewImage: { width: 80, height: 80, borderRadius: 8 },
  removeImageBtn: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: '#dc3545', 
    borderRadius: 10, 
    width: 20, 
    height: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  removeImageText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  postImages: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  postImage: { width: 100, height: 100, borderRadius: 8 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#dc3545', marginBottom: 12 },
});


