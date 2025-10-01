import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post } from '../core/models';

interface Props {
  post: Post;
}

export const PostItem: React.FC<Props> = ({ post }) => {
  return (
    <View style={styles.post}>
      <Text style={styles.postText}>{post.text}</Text>
      <Text style={styles.meta}>{new Date(post.createdAt).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  post: { padding: 12, borderRadius: 8, backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee' },
  postText: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666', marginTop: 6 },
});


