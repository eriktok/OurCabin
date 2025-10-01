import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Card } from '../components/ui/iOSCard';
import { Button } from '../components/ui/iOSButton';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafeIcon } from '../components/ui/SafeIcon';
import { iOSDesignSystem } from '../theme/iOSDesignSystem';
import { iOSList, iOSListItem } from '../components/ui/iOSList';
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
        case 'owner': return iOSDesignSystem.colors.primary;
        case 'admin': return iOSDesignSystem.colors.info;
        case 'member': return iOSDesignSystem.colors.neutral[600];
        case 'guest': return iOSDesignSystem.colors.secondary;
        default: return iOSDesignSystem.colors.neutral[400];
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
            <SafeIcon name="account-circle" size={40} color={iOSDesignSystem.colors.neutral[400]} />
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
          <SafeIcon name="dots-vertical" size={20} color={iOSDesignSystem.colors.neutral[400]} />
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
        case 'booking': return iOSDesignSystem.colors.primary;
        case 'task': return iOSDesignSystem.colors.warning;
        case 'celebration': return iOSDesignSystem.colors.secondary;
        case 'maintenance': return iOSDesignSystem.colors.info;
        default: return iOSDesignSystem.colors.neutral[500];
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
            <SafeIcon name="calendar" size={14} color={iOSDesignSystem.colors.neutral[500]} />
            <Text style={styles.eventDate}>
              {format(new Date(event.startDate), 'MMM dd, yyyy')}
            </Text>
            {event.attendees.length > 0 && (
              <>
                <SafeIcon name="account-group" size={14} color={iOSDesignSystem.colors.neutral[500]} />
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
            <SafeIcon name="heart" size={16} color={iOSDesignSystem.colors.error} />
            <Text style={styles.memoryStatText}>{memory.likes}</Text>
            <SafeIcon name="comment" size={16} color={iOSDesignSystem.colors.neutral[500]} />
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
          style={[styles.quickActionButton, styles.secondaryButton] as any}
          icon={<SafeIcon name="share" size={20} color={iOSDesignSystem.colors.primary} />}
        />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => setActiveTab('members')}
        >
          <SafeIcon name="account-group" size={20} color={activeTab === 'members' ? iOSDesignSystem.colors.primary : iOSDesignSystem.colors.neutral[500]} />
          <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
            Members ({familyMembers.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <SafeIcon name="calendar" size={20} color={activeTab === 'events' ? iOSDesignSystem.colors.primary : iOSDesignSystem.colors.neutral[500]} />
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events ({familyEvents.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'memories' && styles.activeTab]}
          onPress={() => setActiveTab('memories')}
        >
          <SafeIcon name="heart" size={20} color={activeTab === 'memories' ? iOSDesignSystem.colors.primary : iOSDesignSystem.colors.neutral[500]} />
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
    backgroundColor: iOSDesignSystem.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    padding: iOSDesignSystem.spacing.md,
    gap: iOSDesignSystem.spacing.sm,
  },
  quickActionButton: {
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: iOSDesignSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: iOSDesignSystem.colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: iOSDesignSystem.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: iOSDesignSystem.colors.neutral[200],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: iOSDesignSystem.spacing.md,
    gap: iOSDesignSystem.spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: iOSDesignSystem.colors.primary,
  },
  tabText: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
    color: iOSDesignSystem.colors.neutral[500],
  },
  activeTabText: {
    color: iOSDesignSystem.colors.primary,
  },
  content: {
    flex: 1,
    padding: iOSDesignSystem.spacing.md,
  },
  sectionCard: {
    marginBottom: iOSDesignSystem.spacing.lg,
  },
  sectionTitle: {
    fontSize: iOSDesignSystem.typography.fontSize.lg,
    fontWeight: iOSDesignSystem.typography.fontWeight.semibold,
    color: iOSDesignSystem.colors.text.primary,
    marginBottom: iOSDesignSystem.spacing.md,
  },
  membersList: {
    gap: iOSDesignSystem.spacing.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: iOSDesignSystem.spacing.md,
    backgroundColor: iOSDesignSystem.colors.background.tertiary,
    borderRadius: iOSDesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: iOSDesignSystem.colors.neutral[200],
  },
  memberAvatar: {
    marginRight: iOSDesignSystem.spacing.md,
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
    fontSize: iOSDesignSystem.typography.fontSize.base,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
    color: iOSDesignSystem.colors.text.primary,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  memberRole: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOSDesignSystem.spacing.xs,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  memberRoleText: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
  },
  memberJoined: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    color: iOSDesignSystem.colors.text.tertiary,
  },
  memberActions: {
    padding: iOSDesignSystem.spacing.sm,
  },
  eventsList: {
    gap: iOSDesignSystem.spacing.sm,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: iOSDesignSystem.spacing.md,
    backgroundColor: iOSDesignSystem.colors.background.tertiary,
    borderRadius: iOSDesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: iOSDesignSystem.colors.neutral[200],
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: iOSDesignSystem.spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: iOSDesignSystem.typography.fontSize.base,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
    color: iOSDesignSystem.colors.text.primary,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  eventDescription: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    color: iOSDesignSystem.colors.text.secondary,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOSDesignSystem.spacing.sm,
  },
  eventDate: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    color: iOSDesignSystem.colors.text.tertiary,
  },
  eventAttendees: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    color: iOSDesignSystem.colors.text.tertiary,
  },
  memoriesList: {
    gap: iOSDesignSystem.spacing.md,
  },
  memoryCard: {
    backgroundColor: iOSDesignSystem.colors.background.tertiary,
    borderRadius: iOSDesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: iOSDesignSystem.colors.neutral[200],
    overflow: 'hidden',
  },
  memoryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  memoryContent: {
    padding: iOSDesignSystem.spacing.md,
  },
  memoryTitle: {
    fontSize: iOSDesignSystem.typography.fontSize.base,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
    color: iOSDesignSystem.colors.text.primary,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  memoryDescription: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    color: iOSDesignSystem.colors.text.secondary,
    marginBottom: iOSDesignSystem.spacing.sm,
  },
  memoryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: iOSDesignSystem.spacing.sm,
  },
  memoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOSDesignSystem.spacing.sm,
  },
  memoryStatText: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    color: iOSDesignSystem.colors.text.tertiary,
  },
  memoryDate: {
    fontSize: iOSDesignSystem.typography.fontSize.sm,
    color: iOSDesignSystem.colors.text.tertiary,
  },
  memoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: iOSDesignSystem.spacing.xs,
  },
  memoryTag: {
    backgroundColor: iOSDesignSystem.colors.primary + '20',
    paddingHorizontal: iOSDesignSystem.spacing.sm,
    paddingVertical: iOSDesignSystem.spacing.xs,
    borderRadius: iOSDesignSystem.borderRadius.sm,
  },
  memoryTagText: {
    fontSize: iOSDesignSystem.typography.fontSize.xs,
    color: iOSDesignSystem.colors.primary,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
  },
});
