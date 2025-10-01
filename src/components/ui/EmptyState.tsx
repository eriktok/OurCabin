import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={64} color="#ccc" />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const EmptyPosts: React.FC<{ onCreatePost?: () => void }> = ({ onCreatePost }) => (
  <EmptyState
    icon="post-outline"
    title="No posts yet"
    subtitle="Share what's happening at the cabin!"
    actionText="Create First Post"
    onAction={onCreatePost}
  />
);

export const EmptyTasks: React.FC<{ onCreateTask?: () => void }> = ({ onCreateTask }) => (
  <EmptyState
    icon="check-circle-outline"
    title="No tasks yet"
    subtitle="Add your first task to get started!"
    actionText="Add Task"
    onAction={onCreateTask}
  />
);

export const EmptyBookings: React.FC<{ onRequestBooking?: () => void }> = ({ onRequestBooking }) => (
  <EmptyState
    icon="calendar-outline"
    title="No bookings yet"
    subtitle="Request your first cabin stay!"
    actionText="Request Booking"
    onAction={onRequestBooking}
  />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
