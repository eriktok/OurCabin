import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Post } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

export const LogbookScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const api = useCabinApi();

  useEffect(() => {
    api.getPosts('demo-cabin', 20).then(setPosts).catch(console.error);
  }, [api]);

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
    const created = await api.createPost('demo-cabin', { 
      text, 
      imageUrls: selectedImages 
    });
    setPosts((p) => [created, ...p]);
    setText('');
    setSelectedImages([]);
  };

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
  container: { flex: 1, padding: 12 },
  composer: { flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, minHeight: 40 },
  list: { gap: 8 },
  post: { padding: 12, borderRadius: 8, backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee' },
  postText: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666', marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8 },
  likeBtn: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 16 },
  imagePreview: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  imageContainer: { position: 'relative' },
  previewImage: { width: 80, height: 80, borderRadius: 8 },
  removeImageBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ff4444', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  removeImageText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  postImages: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  postImage: { width: 100, height: 100, borderRadius: 8 },
});


