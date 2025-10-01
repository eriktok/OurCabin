import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { Post } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';

export const LogbookScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const api = useCabinApi();

  useEffect(() => {
    api.getPosts('demo-cabin', 20).then(setPosts).catch(console.error);
  }, [api]);

  const submit = async () => {
    if (!text.trim()) return;
    const created = await api.createPost('demo-cabin', { text });
    setPosts((p) => [created, ...p]);
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Write a post..."
          value={text}
          onChangeText={setText}
        />
        <Button title="Post" onPress={submit} />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>{item.text}</Text>
            <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
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
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
  list: { gap: 8 },
  post: { padding: 12, borderRadius: 8, backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee' },
  postText: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666', marginTop: 6 },
});


