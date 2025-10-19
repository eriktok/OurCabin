import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialScreen } from './MaterialScreen';
import { MaterialCard, MaterialButton, MaterialFAB } from '../components/material';
import { useTheme } from 'react-native-paper';
import { Text, Avatar, Chip, Divider } from 'react-native-paper';
import { useCabinApi } from '../services/ServiceProvider';
import { useAppStore } from '../stores/appStore';
import { MaterialIcon } from '../components/MaterialIcon';

interface CabinStats {
  totalPosts: number;
  activeTasks: number;
  upcomingBookings: number;
  familyMembers: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: 'booking' | 'task' | 'post';
  description: string;
}

export const MaterialHomeScreen: React.FC = () => {
  const [stats, setStats] = useState<CabinStats>({
    totalPosts: 0,
    activeTasks: 0,
    upcomingBookings: 0,
    familyMembers: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const api = useCabinApi();
  const { selectedCabin, currentUser } = useAppStore();

  useEffect(() => {
    loadCabinData();
  }, []);

  const loadCabinData = async () => {
    try {
      setLoading(true);
      
      const [posts, tasks, bookings] = await Promise.all([
        api.getPosts('demo-cabin', 10),
        api.getTasks('demo-cabin'),
        api.getBookings('demo-cabin'),
      ]);

      const activeTasks = tasks.filter(task => task.status === 'todo').length;
      const upcomingBookings = bookings.filter(booking => 
        new Date(booking.startDate) > new Date()
      ).length;

      setStats({
        totalPosts: posts.length,
        activeTasks,
        upcomingBookings,
        familyMembers: 4, // Mock data
      });

      // Create upcoming events
      const events: UpcomingEvent[] = [
        {
          id: '1',
          title: 'Weekend Getaway',
          date: '2024-01-15',
          type: 'booking',
          description: 'Family trip to the cabin',
        },
        {
          id: '2',
          title: 'Clean the kitchen',
          date: '2024-01-12',
          type: 'task',
          description: 'Due tomorrow',
        },
        {
          id: '3',
          title: 'New family photo',
          date: '2024-01-10',
          type: 'post',
          description: 'Beautiful sunset view',
        },
      ];

      setUpcomingEvents(events);
      setRecentPosts(posts.slice(0, 3));
    } catch (error) {
      console.error('Failed to load cabin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: number;
    icon: string;
    color: string;
  }) => (
    <MaterialCard variant="elevated" style={styles.statCard}>
      <View style={styles.statContent}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <MaterialIcon 
            name={icon} 
            size={24} 
            color="white"
          />
        </View>
        <View style={styles.statText}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {value}
          </Text>
          <Text variant="bodyMedium" style={styles.statTitle}>
            {title}
          </Text>
        </View>
      </View>
    </MaterialCard>
  );

  const EventItem = ({ event }: { event: UpcomingEvent }) => {
    const getEventIcon = () => {
      switch (event.type) {
        case 'booking': return 'calendar-clock';
        case 'task': return 'format-list-checks';
        case 'post': return 'newspaper';
        default: return 'circle';
      }
    };

    const getEventColor = () => {
      switch (event.type) {
        case 'booking': return theme.colors.primary;
        case 'task': return theme.colors.secondary;
        case 'post': return theme.colors.tertiary;
        default: return theme.colors.onSurface;
      }
    };

    return (
      <MaterialCard variant="outlined" style={styles.eventCard}>
        <View style={styles.eventContent}>
          <View style={[styles.eventIconContainer, { backgroundColor: getEventColor() }]}>
            <MaterialIcon 
              name={getEventIcon()} 
              size={20} 
              color="white"
            />
          </View>
          <View style={styles.eventText}>
            <Text variant="titleMedium" style={styles.eventTitle}>
              {event.title}
            </Text>
            <Text variant="bodyMedium" style={styles.eventDescription}>
              {event.description}
            </Text>
            <Text variant="bodySmall" style={styles.eventDate}>
              {event.date}
            </Text>
          </View>
        </View>
      </MaterialCard>
    );
  };

  if (loading) {
    return (
      <MaterialScreen title="Loading..." scrollable={false}>
        <View style={styles.loadingContainer}>
          <Text>Loading cabin data...</Text>
        </View>
      </MaterialScreen>
    );
  }

  return (
    <MaterialScreen
      title="Cabin Home"
      subtitle={selectedCabin?.name}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <MaterialCard variant="elevated" style={styles.welcomeCard}>
          <Text variant="headlineSmall" style={styles.welcomeTitle}>
            Welcome back! 👋
          </Text>
          <Text variant="bodyLarge" style={styles.welcomeSubtitle}>
            Here's what's happening at {selectedCabin?.name}
          </Text>
        </MaterialCard>

        {/* Stats Section */}
        <MaterialCard variant="elevated" style={styles.statsCard}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Cabin Overview
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Posts"
              value={stats.totalPosts}
              icon="newspaper"
              color={theme.colors.primary}
            />
            <StatCard
              title="Active Tasks"
              value={stats.activeTasks}
              icon="format-list-checks"
              color={theme.colors.secondary}
            />
            <StatCard
              title="Upcoming Bookings"
              value={stats.upcomingBookings}
              icon="calendar-clock"
              color={theme.colors.tertiary}
            />
            <StatCard
              title="Family Members"
              value={stats.familyMembers}
              icon="account-multiple"
              color={theme.colors.primary}
            />
          </View>
        </MaterialCard>

        {/* Upcoming Events */}
        <MaterialCard variant="elevated" style={styles.eventsCard}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Upcoming Events
          </Text>
          {upcomingEvents.length === 0 ? (
            <Text variant="bodyLarge" style={styles.emptyText}>
              No upcoming events
            </Text>
          ) : (
            <View style={styles.eventsList}>
              {upcomingEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </View>
          )}
        </MaterialCard>

        {/* Recent Posts */}
        <MaterialCard variant="elevated" style={styles.postsCard}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recent Posts
          </Text>
          {recentPosts.length === 0 ? (
            <Text variant="bodyLarge" style={styles.emptyText}>
              No recent posts
            </Text>
          ) : (
            <View style={styles.postsList}>
              {recentPosts.map((post, index) => (
                <MaterialCard key={index} variant="outlined" style={styles.postCard}>
                  <View style={styles.postContent}>
                    <Avatar.Text size={32} label={post.authorName?.[0] || 'U'} />
                    <View style={styles.postText}>
                      <Text variant="titleMedium" style={styles.postTitle}>
                        {post.authorName}
                      </Text>
                      <Text variant="bodyMedium" style={styles.postText}>
                        {post.text}
                      </Text>
                    </View>
                  </View>
                </MaterialCard>
              ))}
            </View>
          )}
        </MaterialCard>

        {/* Quick Actions */}
        <MaterialCard variant="elevated" style={styles.actionsCard}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <MaterialButton
              variant="outlined"
              onPress={() => console.log('Create post')}
              style={styles.actionButton}
            >
              Create Post
            </MaterialButton>
            <MaterialButton
              variant="outlined"
              onPress={() => console.log('Add task')}
              style={styles.actionButton}
            >
              Add Task
            </MaterialButton>
            <MaterialButton
              variant="outlined"
              onPress={() => console.log('Book cabin')}
              style={styles.actionButton}
            >
              Book Cabin
            </MaterialButton>
            <MaterialButton
              variant="outlined"
              onPress={() => console.log('Invite family')}
              style={styles.actionButton}
            >
              Invite Family
            </MaterialButton>
          </View>
        </MaterialCard>
      </ScrollView>
    </MaterialScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    marginBottom: 16,
  },
  welcomeTitle: {
    marginBottom: 8,
  },
  welcomeSubtitle: {
    opacity: 0.8,
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
  },
  statTitle: {
    opacity: 0.8,
  },
  eventsCard: {
    marginBottom: 16,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    marginBottom: 8,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventText: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: 'bold',
  },
  eventDescription: {
    opacity: 0.8,
  },
  eventDate: {
    opacity: 0.6,
  },
  postsCard: {
    marginBottom: 16,
  },
  postsList: {
    gap: 12,
  },
  postCard: {
    marginBottom: 8,
  },
  postContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  postText: {
    flex: 1,
  },
  postTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
