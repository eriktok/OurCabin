import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { MaterialScreen } from './MaterialScreen';
import { Text, Surface } from 'react-native-paper';
import { useCabinApi } from '../services/ServiceProvider';
import { useAppStore } from '../stores/appStore';
import { PremiumStatCard } from '../components/PremiumStatCard';
import { PremiumEventCard } from '../components/PremiumEventCard';
import { PremiumActionButton } from '../components/PremiumActionButton';

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
  priority: 'high' | 'medium' | 'low';
}

export const PremiumHomeScreen: React.FC = () => {
  const api = useCabinApi();
  const { selectedCabin } = useAppStore();

  const [stats, setStats] = useState<CabinStats>({
    totalPosts: 0,
    activeTasks: 0,
    upcomingBookings: 0,
    familyMembers: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (selectedCabin?.id) {
      loadCabinData(selectedCabin.id);
    }
  }, [selectedCabin?.id]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadCabinData = async (cabinId: string) => {
    setLoading(true);
    try {
      const [posts, tasks, bookings] = await Promise.all([
        api.getPosts(cabinId, 10),
        api.getTasks(cabinId),
        api.getBookings(cabinId),
      ]);

      const activeTasks = tasks.filter(task => task.status === 'todo').length;
      const upcomingBookings = bookings.filter(booking =>
        new Date(booking.startDate) > new Date() && booking.status === 'approved'
      ).length;

      setStats({
        totalPosts: posts.length,
        activeTasks,
        upcomingBookings,
        familyMembers: 4,
      });

      setUpcomingEvents(createSampleEvents());
    } catch (error) {
      console.error('Failed to load cabin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleEvents = (): UpcomingEvent[] => [
    {
      id: '1',
      title: 'Weekend Getaway',
      date: '2024-01-15',
      type: 'booking',
      description: 'Family trip to the cabin',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Clean the fireplace',
      date: '2024-01-12',
      type: 'task',
      description: 'Annual fireplace maintenance',
      priority: 'medium',
    },
  ];

  const handleActionPress = (action: string) => {
    console.log(`Action pressed: ${action}`);
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
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          <View style={[styles.heroGradient, { backgroundColor: '#2E7D32' }]}>
            <View style={styles.heroContent}>
              <Text variant="headlineLarge" style={styles.heroTitle}>
                Welcome back! 👋
              </Text>
              <Text variant="bodyLarge" style={styles.heroSubtitle}>
                Here's what's happening at {selectedCabin?.name}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <PremiumStatCard
            title="Posts"
            value={stats.totalPosts}
            icon="📰"
            gradient={['#FF6B6B', '#FF8E8E']}
            opacity={fadeAnim}
          />
          <PremiumStatCard
            title="Tasks"
            value={stats.activeTasks}
            icon="✅"
            gradient={['#4ECDC4', '#44A08D']}
            opacity={fadeAnim}
          />
          <PremiumStatCard
            title="Bookings"
            value={stats.upcomingBookings}
            icon="📅"
            gradient={['#FFD93D', '#FFA726']}
            opacity={fadeAnim}
          />
          <PremiumStatCard
            title="Family"
            value={stats.familyMembers}
            icon="👥"
            gradient={['#9C27B0', '#E91E63']}
            opacity={fadeAnim}
          />
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Upcoming Events
            </Text>
            <TouchableOpacity>
              <Text variant="bodyMedium" style={styles.seeAllText}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {upcomingEvents.length === 0 ? (
            <Surface style={styles.emptyState} elevation={1}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No upcoming events
              </Text>
            </Surface>
          ) : (
            <View style={styles.eventsList}>
              {upcomingEvents.map((event) => (
                <PremiumEventCard key={event.id} event={event} opacity={fadeAnim} />
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <PremiumActionButton
              icon="📝"
              label="New Post"
              onPress={() => handleActionPress('new-post')}
            />
            <PremiumActionButton
              icon="✅"
              label="Add Task"
              onPress={() => handleActionPress('add-task')}
            />
            <PremiumActionButton
              icon="📅"
              label="Book Cabin"
              onPress={() => handleActionPress('book-cabin')}
            />
            <PremiumActionButton
              icon="👥"
              label="Invite Family"
              onPress={() => handleActionPress('invite-family')}
            />
          </View>
        </View>
      </ScrollView>
    </MaterialScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  eventsSection: {
    margin: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  eventsList: {
    gap: 12,
  },
  actionsSection: {
    margin: 16,
    marginTop: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});
