import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Post } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';
import { useAsync } from '../hooks/useAsync';
import { ErrorHandler } from '../utils/errorHandler';
import { PostComposerModal } from '../components/PostComposerModal';
import { CommentsSection } from '../components/CommentsSection';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistanceToNow } from 'date-fns';

export const LogbookScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const api = useCabinApi();
  const { loading, error, execute } = useAsync<Post[]>();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    execute(() => api.getPosts('demo-cabin', 20))
      .then(setPosts)
      .catch((err) => {
        ErrorHandler.showAlert(ErrorHandler.handle(err));
      });
  };

  const handleCreatePost = async (content: string, imageUri?: string) => {
    try {
      const created = await api.createPost('demo-cabin', { 
        text: content, 
        imageUrls: imageUri ? [imageUri] : []
      });
      setPosts(prev => [created, ...prev]);
    } catch (err) {
      ErrorHandler.showAlert(ErrorHandler.handle(err));
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await api.likePost(postId);
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: (p.likes ?? 0) + 1 } : p
      ));
    } catch (err) {
      ErrorHandler.showAlert(ErrorHandler.handle(err));
    }
  };

  const handleShowComments = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  if (loading && posts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load posts</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Cabin Logbook" 
        right={
          <TouchableOpacity onPress={() => setShowComposer(true)}>
            <Icon name="plus" size={24} color="#2E7D32" />
          </TouchableOpacity>
        }
      />
      
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.postHeader}>
              <Text style={styles.postAuthor}>{item.authorName}</Text>
              <Text style={styles.postTime}>
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </Text>
            </View>
            
            <Text style={styles.postText}>{item.text}</Text>
            
            {item.imageUrls && item.imageUrls.length > 0 && (
              <View style={styles.postImages}>
                {item.imageUrls.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.postImage} />
                ))}
              </View>
            )}
            
            <View style={styles.postActions}>
              <TouchableOpacity
                onPress={() => handleLikePost(item.id)}
                style={styles.actionButton}
              >
                <Icon name="heart-outline" size={20} color="#666" />
                <Text style={styles.actionText}>{item.likes ?? 0}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleShowComments(item.id)}
                style={styles.actionButton}
              >
                <Icon name="comment-outline" size={20} color="#666" />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="post-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Share what's happening at the cabin!</Text>
          </View>
        }
      />

      <PostComposerModal
        visible={showComposer}
        onClose={() => setShowComposer(false)}
        onSubmit={handleCreatePost}
      />

      {selectedPostId && (
        <CommentsSection
          postId={selectedPostId}
          visible={showComments}
          onClose={() => {
            setShowComments(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F8FA' 
  },
  list: { 
    paddingBottom: 16 
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  postText: { 
    fontSize: 16, 
    lineHeight: 24, 
    color: '#1A1F2C',
    marginBottom: 12,
  },
  postImages: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 12, 
    flexWrap: 'wrap' 
  },
  postImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 8 
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  centerContent: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: '#666' 
  },
  errorText: { 
    fontSize: 16, 
    color: '#D32F2F', 
    marginBottom: 12 
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});


