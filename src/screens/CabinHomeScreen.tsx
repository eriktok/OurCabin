import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafeIcon } from '../components/ui/SafeIcon';
import { DesignSystem } from '../theme/designSystem';
import { useCabinApi } from '../services/ServiceProvider';
import { useAppStore } from '../stores/appStore';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

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

export const CabinHomeScreen: React.FC = () => {
  const [stats, setStats] = useState<CabinStats>({
    totalPosts: 0,
    activeTasks: 0,
    upcomingBookings: 0,
    familyMembers: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useCabinApi();
  const { selectedCabin, currentUser } = useAppStore();

  useEffect(() => {
    loadCabinData();
  }, []);

  const loadCabinData = async () => {
    try {
      setLoading(true);
      
      // Load cabin statistics
      const [posts, tasks, bookings] = await Promise.all([
        api.getPosts('demo-cabin'),
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
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <SafeIcon name={icon} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const EventCard = ({ event }: { event: UpcomingEvent }) => {
    const getEventIcon = (type: string) => {
      switch (type) {
        case 'booking': return 'calendar-check';
        case 'task': return 'check-circle';
        case 'post': return 'post';
        default: return 'information';
      }
    };

    const getEventColor = (type: string) => {
      switch (type) {
        case 'booking': return DesignSystem.colors.primary[500];
        case 'task': return DesignSystem.colors.warning;
        case 'post': return DesignSystem.colors.info;
        default: return DesignSystem.colors.neutral[500];
      }
    };

    return (
      <TouchableOpacity style={styles.eventCard}>
        <View style={styles.eventIcon}>
          <SafeIcon 
            name={getEventIcon(event.type)} 
            size={20} 
            color={getEventColor(event.type)} 
          />
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <Text style={styles.eventDate}>
            {format(new Date(event.date), 'MMM dd, yyyy')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Cabin Home" />
        <View style={styles.loadingContainer}>
          <Text>Loading cabin information...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Cabin Home" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>
                Welcome to {selectedCabin?.name || 'Your Cabin'}! 🏡
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Your family's shared cabin experience starts here
              </Text>
            </View>
            <View style={styles.welcomeImage}>
              <SafeIcon name="home-heart" size={48} color={DesignSystem.colors.primary[500]} />
            </View>
          </View>
        </Card>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Posts"
            value={stats.totalPosts}
            icon="post"
            color={DesignSystem.colors.primary[500]}
          />
          <StatCard
            title="Active Tasks"
            value={stats.activeTasks}
            icon="check-circle"
            color={DesignSystem.colors.warning}
          />
          <StatCard
            title="Upcoming Bookings"
            value={stats.upcomingBookings}
            icon="calendar-check"
            color={DesignSystem.colors.info}
          />
          <StatCard
            title="Family Members"
            value={stats.familyMembers}
            icon="account-group"
            color={DesignSystem.colors.secondary[500]}
          />
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <SafeIcon name="plus-circle" size={24} color={DesignSystem.colors.primary[500]} />
              <Text style={styles.quickActionText}>New Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <SafeIcon name="check-circle" size={24} color={DesignSystem.colors.warning} />
              <Text style={styles.quickActionText}>Add Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <SafeIcon name="calendar-plus" size={24} color={DesignSystem.colors.info} />
              <Text style={styles.quickActionText}>Book Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <SafeIcon name="account-plus" size={24} color={DesignSystem.colors.secondary[500]} />
              <Text style={styles.quickActionText}>Invite Family</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Upcoming Events */}
        <Card style={styles.eventsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.eventsList}>
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        </Card>

        {/* Family Sharing Features */}
        <Card style={styles.familyCard}>
          <Text style={styles.sectionTitle}>Family Sharing</Text>
          <View style={styles.familyFeatures}>
            <TouchableOpacity style={styles.familyFeature}>
              <View style={styles.familyFeatureIcon}>
                <SafeIcon name="account-group" size={24} color={DesignSystem.colors.primary[500]} />
              </View>
              <View style={styles.familyFeatureContent}>
                <Text style={styles.familyFeatureTitle}>Invite Family Members</Text>
                <Text style={styles.familyFeatureDescription}>
                  Share your cabin with family and friends
                </Text>
              </View>
              <SafeIcon name="chevron-right" size={20} color={DesignSystem.colors.neutral[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.familyFeature}>
              <View style={styles.familyFeatureIcon}>
                <SafeIcon name="calendar-multiple" size={24} color={DesignSystem.colors.info} />
              </View>
              <View style={styles.familyFeatureContent}>
                <Text style={styles.familyFeatureTitle}>Family Calendar</Text>
                <Text style={styles.familyFeatureDescription}>
                  Coordinate visits and special events
                </Text>
              </View>
              <SafeIcon name="chevron-right" size={20} color={DesignSystem.colors.neutral[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.familyFeature}>
              <View style={styles.familyFeatureIcon}>
                <SafeIcon name="heart" size={24} color={DesignSystem.colors.error} />
              </View>
              <View style={styles.familyFeatureContent}>
                <Text style={styles.familyFeatureTitle}>Family Memories</Text>
                <Text style={styles.familyFeatureDescription}>
                  Share photos and create lasting memories
                </Text>
              </View>
              <SafeIcon name="chevron-right" size={20} color={DesignSystem.colors.neutral[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.familyFeature}>
              <View style={styles.familyFeatureIcon}>
                <SafeIcon name="shield-check" size={24} color={DesignSystem.colors.success} />
              </View>
              <View style={styles.familyFeatureContent}>
                <Text style={styles.familyFeatureTitle}>Cabin Rules</Text>
                <Text style={styles.familyFeatureDescription}>
                  Set and share cabin guidelines
                </Text>
              </View>
              <SafeIcon name="chevron-right" size={20} color={DesignSystem.colors.neutral[400]} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentPosts.map((post, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <SafeIcon name="post" size={16} color={DesignSystem.colors.primary[500]} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{post.title}</Text>
                  <Text style={styles.activityTime}>
                    {format(new Date(post.createdAt), 'MMM dd, h:mm a')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: DesignSystem.spacing.md,
  },
  welcomeCard: {
    marginBottom: DesignSystem.spacing.lg,
    backgroundColor: DesignSystem.colors.primary[50],
    borderLeftWidth: 4,
    borderLeftColor: DesignSystem.colors.primary[500],
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: DesignSystem.typography.fontSize.xl,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.text.secondary,
    lineHeight: DesignSystem.typography.lineHeight.relaxed,
  },
  welcomeImage: {
    marginLeft: DesignSystem.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: DesignSystem.spacing.lg,
    gap: DesignSystem.spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: (width - DesignSystem.spacing.md * 3) / 2,
    backgroundColor: DesignSystem.colors.surface.primary,
    borderRadius: DesignSystem.borderRadius.lg,
    padding: DesignSystem.spacing.md,
    borderLeftWidth: 4,
    ...DesignSystem.shadows.sm,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: DesignSystem.typography.fontSize['2xl'],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.xs,
  },
  statTitle: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginTop: DesignSystem.spacing.xs,
    textAlign: 'center',
  },
  quickActionsCard: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignSystem.spacing.sm,
  },
  quickAction: {
    flex: 1,
    minWidth: (width - DesignSystem.spacing.md * 3) / 2,
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.tertiary,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.neutral[200],
  },
  quickActionText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.xs,
    textAlign: 'center',
  },
  eventsCard: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  seeAllText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  eventsList: {
    gap: DesignSystem.spacing.sm,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.tertiary,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.neutral[200],
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignSystem.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignSystem.spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  eventDescription: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.xs,
  },
  eventDate: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.tertiary,
  },
  familyCard: {
    marginBottom: DesignSystem.spacing.lg,
  },
  familyFeatures: {
    gap: DesignSystem.spacing.sm,
  },
  familyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.tertiary,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.neutral[200],
  },
  familyFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignSystem.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignSystem.spacing.md,
  },
  familyFeatureContent: {
    flex: 1,
  },
  familyFeatureTitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  familyFeatureDescription: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
  },
  activityCard: {
    marginBottom: DesignSystem.spacing.lg,
  },
  activityList: {
    gap: DesignSystem.spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.tertiary,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.neutral[200],
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DesignSystem.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignSystem.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  activityTime: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.tertiary,
  },
});
