import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafeIcon } from '../components/ui/SafeIcon';
import { DesignSystem } from '../theme/designSystem';
import { FamilySharingService, FamilyMember, FamilyEvent, FamilyMemory } from '../services/FamilySharingService';
import { useAppStore } from '../stores/appStore';
import { format } from 'date-fns';

export const FamilySharingScreen: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyEvents, setFamilyEvents] = useState<FamilyEvent[]>([]);
  const [familyMemories, setFamilyMemories] = useState<FamilyMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'memories'>('members');
  
  const familyService = FamilySharingService.getInstance();
  const { selectedCabin } = useAppStore();

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      setLoading(true);
      const [members, events, memories] = await Promise.all([
        familyService.getFamilyMembers(selectedCabin?.id || 'demo-cabin'),
        familyService.getFamilyEvents(selectedCabin?.id || 'demo-cabin'),
        familyService.getFamilyMemories(selectedCabin?.id || 'demo-cabin'),
      ]);
      
      setFamilyMembers(members);
      setFamilyEvents(events);
      setFamilyMemories(memories);
    } catch (error) {
      console.error('Failed to load family data:', error);
      Alert.alert('Error', 'Failed to load family information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteFamily = async () => {
    try {
      const invite = await familyService.createFamilyInvite(
        selectedCabin?.id || 'demo-cabin',
        'Join our family cabin! 🏡',
        30,
        10
      );
      
      await familyService.shareCabinInvite(invite, selectedCabin?.name || 'Our Cabin');
      Alert.alert('Success', 'Family invite sent successfully!');
    } catch (error) {
      console.error('Failed to create invite:', error);
      Alert.alert('Error', 'Failed to create family invite. Please try again.');
    }
  };

  const handleShareCabin = async () => {
    try {
      await familyService.shareCabinInfo(
        selectedCabin?.id || 'demo-cabin',
        selectedCabin?.name || 'Our Cabin'
      );
    } catch (error) {
      console.error('Failed to share cabin:', error);
      Alert.alert('Error', 'Failed to share cabin information. Please try again.');
    }
  };

  const MemberCard = ({ member }: { member: FamilyMember }) => {
    const getRoleColor = (role: string) => {
      switch (role) {
        case 'owner': return DesignSystem.colors.primary[500];
        case 'admin': return DesignSystem.colors.info;
        case 'member': return DesignSystem.colors.neutral[600];
        case 'guest': return DesignSystem.colors.secondary[500];
        default: return DesignSystem.colors.neutral[400];
      }
    };

    const getRoleIcon = (role: string) => {
      switch (role) {
        case 'owner': return 'crown';
        case 'admin': return 'shield-check';
        case 'member': return 'account';
        case 'guest': return 'account-outline';
        default: return 'account';
      }
    };

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberAvatar}>
          {member.photoUrl ? (
            <Image source={{ uri: member.photoUrl }} style={styles.avatarImage} />
          ) : (
            <SafeIcon name="account-circle" size={40} color={DesignSystem.colors.neutral[400]} />
          )}
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.displayName}</Text>
          <View style={styles.memberRole}>
            <SafeIcon 
              name={getRoleIcon(member.role)} 
              size={16} 
              color={getRoleColor(member.role)} 
            />
            <Text style={[styles.memberRoleText, { color: getRoleColor(member.role) }]}>
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </Text>
          </View>
          <Text style={styles.memberJoined}>
            Joined {format(new Date(member.joinedAt), 'MMM dd, yyyy')}
          </Text>
        </View>
        <TouchableOpacity style={styles.memberActions}>
          <SafeIcon name="dots-vertical" size={20} color={DesignSystem.colors.neutral[400]} />
        </TouchableOpacity>
      </View>
    );
  };

  const EventCard = ({ event }: { event: FamilyEvent }) => {
    const getEventIcon = (type: string) => {
      switch (type) {
        case 'booking': return 'calendar-check';
        case 'task': return 'check-circle';
        case 'celebration': return 'party-popper';
        case 'maintenance': return 'wrench';
        default: return 'calendar';
      }
    };

    const getEventColor = (type: string) => {
      switch (type) {
        case 'booking': return DesignSystem.colors.primary[500];
        case 'task': return DesignSystem.colors.warning;
        case 'celebration': return DesignSystem.colors.secondary[500];
        case 'maintenance': return DesignSystem.colors.info;
        default: return DesignSystem.colors.neutral[500];
      }
    };

    return (
      <View style={styles.eventCard}>
        <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.type) + '20' }]}>
          <SafeIcon name={getEventIcon(event.type)} size={24} color={getEventColor(event.type)} />
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <View style={styles.eventDetails}>
            <SafeIcon name="calendar" size={14} color={DesignSystem.colors.neutral[500]} />
            <Text style={styles.eventDate}>
              {format(new Date(event.startDate), 'MMM dd, yyyy')}
            </Text>
            {event.attendees.length > 0 && (
              <>
                <SafeIcon name="account-group" size={14} color={DesignSystem.colors.neutral[500]} />
                <Text style={styles.eventAttendees}>
                  {event.attendees.length} attending
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const MemoryCard = ({ memory }: { memory: FamilyMemory }) => (
    <View style={styles.memoryCard}>
      <Image source={{ uri: memory.imageUrl }} style={styles.memoryImage} />
      <View style={styles.memoryContent}>
        <Text style={styles.memoryTitle}>{memory.title}</Text>
        <Text style={styles.memoryDescription}>{memory.description}</Text>
        <View style={styles.memoryMeta}>
          <View style={styles.memoryStats}>
            <SafeIcon name="heart" size={16} color={DesignSystem.colors.error} />
            <Text style={styles.memoryStatText}>{memory.likes}</Text>
            <SafeIcon name="comment" size={16} color={DesignSystem.colors.neutral[500]} />
            <Text style={styles.memoryStatText}>{memory.comments}</Text>
          </View>
          <Text style={styles.memoryDate}>
            {format(new Date(memory.createdAt), 'MMM dd, yyyy')}
          </Text>
        </View>
        {memory.tags.length > 0 && (
          <View style={styles.memoryTags}>
            {memory.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.memoryTag}>
                <Text style={styles.memoryTagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Family Sharing" />
        <View style={styles.loadingContainer}>
          <Text>Loading family information...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Family Sharing" />
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <PrimaryButton
          title="Invite Family"
          onPress={handleInviteFamily}
          style={styles.quickActionButton}
          icon={<SafeIcon name="account-plus" size={20} color="#fff" />}
        />
        <PrimaryButton
          title="Share Cabin"
          onPress={handleShareCabin}
          style={[styles.quickActionButton, styles.secondaryButton]}
          icon={<SafeIcon name="share" size={20} color={DesignSystem.colors.primary[500]} />}
        />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => setActiveTab('members')}
        >
          <SafeIcon name="account-group" size={20} color={activeTab === 'members' ? DesignSystem.colors.primary[500] : DesignSystem.colors.neutral[500]} />
          <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
            Members ({familyMembers.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <SafeIcon name="calendar" size={20} color={activeTab === 'events' ? DesignSystem.colors.primary[500] : DesignSystem.colors.neutral[500]} />
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events ({familyEvents.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'memories' && styles.activeTab]}
          onPress={() => setActiveTab('memories')}
        >
          <SafeIcon name="heart" size={20} color={activeTab === 'memories' ? DesignSystem.colors.primary[500] : DesignSystem.colors.neutral[500]} />
          <Text style={[styles.tabText, activeTab === 'memories' && styles.activeTabText]}>
            Memories ({familyMemories.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'members' && (
          <View>
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Family Members</Text>
              <View style={styles.membersList}>
                {familyMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </View>
            </Card>
          </View>
        )}

        {activeTab === 'events' && (
          <View>
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Family Events</Text>
              <View style={styles.eventsList}>
                {familyEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </View>
            </Card>
          </View>
        )}

        {activeTab === 'memories' && (
          <View>
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Family Memories</Text>
              <View style={styles.memoriesList}>
                {familyMemories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </View>
            </Card>
          </View>
        )}
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
  quickActions: {
    flexDirection: 'row',
    padding: DesignSystem.spacing.md,
    gap: DesignSystem.spacing.sm,
  },
  quickActionButton: {
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: DesignSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary[500],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: DesignSystem.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.neutral[200],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DesignSystem.spacing.md,
    gap: DesignSystem.spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: DesignSystem.colors.primary[500],
  },
  tabText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.neutral[500],
  },
  activeTabText: {
    color: DesignSystem.colors.primary[500],
  },
  content: {
    flex: 1,
    padding: DesignSystem.spacing.md,
  },
  sectionCard: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.md,
  },
  membersList: {
    gap: DesignSystem.spacing.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.tertiary,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.neutral[200],
  },
  memberAvatar: {
    marginRight: DesignSystem.spacing.md,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  memberRole: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
    marginBottom: DesignSystem.spacing.xs,
  },
  memberRoleText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  memberJoined: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.tertiary,
  },
  memberActions: {
    padding: DesignSystem.spacing.sm,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  eventDate: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.tertiary,
  },
  eventAttendees: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.tertiary,
  },
  memoriesList: {
    gap: DesignSystem.spacing.md,
  },
  memoryCard: {
    backgroundColor: DesignSystem.colors.background.tertiary,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.neutral[200],
    overflow: 'hidden',
  },
  memoryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  memoryContent: {
    padding: DesignSystem.spacing.md,
  },
  memoryTitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  memoryDescription: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.sm,
  },
  memoryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  memoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  memoryStatText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.tertiary,
  },
  memoryDate: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.tertiary,
  },
  memoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignSystem.spacing.xs,
  },
  memoryTag: {
    backgroundColor: DesignSystem.colors.primary[50],
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.borderRadius.sm,
  },
  memoryTagText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
});
