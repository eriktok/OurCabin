import { Alert, Share, Linking } from 'react-native';
import { supabase } from '../config/supabase';

export interface FamilyMember {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
  lastActive: string;
  permissions: {
    canCreatePosts: boolean;
    canCreateTasks: boolean;
    canApproveBookings: boolean;
    canManageMembers: boolean;
    canEditSettings: boolean;
  };
}

export interface FamilyInvite {
  id: string;
  cabinId: string;
  code: string;
  expiresAt: string;
  maxUses?: number;
  usedCount: number;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  message?: string;
}

export interface FamilyEvent {
  id: string;
  cabinId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  type: 'booking' | 'task' | 'celebration' | 'maintenance';
  createdBy: string;
  createdAt: string;
  attendees: string[];
}

export interface FamilyMemory {
  id: string;
  cabinId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  createdBy: string;
  tags: string[];
  likes: number;
  comments: number;
}

export class FamilySharingService {
  private static instance: FamilySharingService;

  static getInstance(): FamilySharingService {
    if (!FamilySharingService.instance) {
      FamilySharingService.instance = new FamilySharingService();
    }
    return FamilySharingService.instance;
  }

  // Get family members
  async getFamilyMembers(cabinId: string): Promise<FamilyMember[]> {
    const { data, error } = await supabase
      .from('cabin_members')
      .select(`
        *,
        users!inner(id, display_name, email, photo_url)
      `)
      .eq('cabin_id', cabinId)
      .order('joined_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(member => ({
      id: member.id,
      userId: member.user_id,
      displayName: member.users.display_name,
      email: member.users.email,
      photoUrl: member.users.photo_url,
      role: member.role,
      joinedAt: member.joined_at,
      lastActive: member.last_active || member.joined_at,
      permissions: member.permissions,
    }));
  }

  // Create family invite
  async createFamilyInvite(
    cabinId: string, 
    message?: string, 
    expiresInDays: number = 30,
    maxUses?: number
  ): Promise<FamilyInvite> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const inviteCode = this.generateInviteCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const inviteData = {
      cabin_id: cabinId,
      code: inviteCode,
      expires_at: expiresAt.toISOString(),
      max_uses: maxUses,
      used_count: 0,
      created_by: user.id,
      message: message,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('cabin_invites')
      .insert(inviteData)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      code: data.code,
      expiresAt: data.expires_at,
      maxUses: data.max_uses,
      usedCount: data.used_count,
      createdBy: data.created_by,
      createdAt: data.created_at,
      isActive: data.is_active,
      message: data.message,
    };
  }

  // Share cabin invite
  async shareCabinInvite(invite: FamilyInvite, cabinName: string): Promise<void> {
    const shareMessage = `Join our family cabin "${cabinName}"! 🏡\n\n` +
      `Invite Code: ${invite.code}\n\n` +
      `Download OurCabin app and use this code to join our shared cabin experience.\n\n` +
      (invite.message ? `Message: ${invite.message}\n\n` : '') +
      `This invite expires on ${new Date(invite.expiresAt).toLocaleDateString()}.`;

    try {
      await Share.share({
        message: shareMessage,
        title: `Join ${cabinName} on OurCabin`,
      });
    } catch (error) {
      console.error('Failed to share invite:', error);
      throw new Error('Failed to share invite');
    }
  }

  // Join cabin with invite code
  async joinCabinWithInvite(inviteCode: string): Promise<{ cabinId: string; cabinName: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get invite details
    const { data: invite, error: inviteError } = await supabase
      .from('cabin_invites')
      .select(`
        *,
        cabins!inner(id, name)
      `)
      .eq('code', inviteCode)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (inviteError || !invite) {
      throw new Error('Invalid or expired invite code');
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('cabin_members')
      .select('id')
      .eq('cabin_id', invite.cabin_id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      throw new Error('You are already a member of this cabin');
    }

    // Add user to cabin
    const { error: memberError } = await supabase
      .from('cabin_members')
      .insert({
        cabin_id: invite.cabin_id,
        user_id: user.id,
        role: 'member',
        invited_by: invite.created_by,
        permissions: this.getDefaultPermissions('member'),
      });

    if (memberError) throw memberError;

    // Update invite usage
    const { error: updateError } = await supabase
      .from('cabin_invites')
      .update({
        used_count: invite.used_count + 1,
        is_active: invite.max_uses ? invite.used_count + 1 < invite.max_uses : true,
      })
      .eq('id', invite.id);

    if (updateError) throw updateError;

    return {
      cabinId: invite.cabin_id,
      cabinName: invite.cabins.name,
    };
  }

  // Create family event
  async createFamilyEvent(
    cabinId: string,
    title: string,
    description: string,
    startDate: string,
    endDate?: string,
    type: FamilyEvent['type'] = 'celebration',
    attendees: string[] = []
  ): Promise<FamilyEvent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const eventData = {
      cabin_id: cabinId,
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      type,
      created_by: user.id,
      attendees,
    };

    const { data, error } = await supabase
      .from('family_events')
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      type: data.type,
      createdBy: data.created_by,
      createdAt: data.created_at,
      attendees: data.attendees,
    };
  }

  // Get family events
  async getFamilyEvents(cabinId: string): Promise<FamilyEvent[]> {
    const { data, error } = await supabase
      .from('family_events')
      .select('*')
      .eq('cabin_id', cabinId)
      .order('start_date', { ascending: true });

    if (error) throw error;

    return (data || []).map(event => ({
      id: event.id,
      cabinId: event.cabin_id,
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      type: event.type,
      createdBy: event.created_by,
      createdAt: event.created_at,
      attendees: event.attendees,
    }));
  }

  // Create family memory
  async createFamilyMemory(
    cabinId: string,
    title: string,
    description: string,
    imageUrl: string,
    tags: string[] = []
  ): Promise<FamilyMemory> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const memoryData = {
      cabin_id: cabinId,
      title,
      description,
      image_url: imageUrl,
      created_by: user.id,
      tags,
      likes: 0,
      comments: 0,
    };

    const { data, error } = await supabase
      .from('family_memories')
      .insert(memoryData)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      createdAt: data.created_at,
      createdBy: data.created_by,
      tags: data.tags,
      likes: data.likes,
      comments: data.comments,
    };
  }

  // Get family memories
  async getFamilyMemories(cabinId: string): Promise<FamilyMemory[]> {
    const { data, error } = await supabase
      .from('family_memories')
      .select('*')
      .eq('cabin_id', cabinId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(memory => ({
      id: memory.id,
      cabinId: memory.cabin_id,
      title: memory.title,
      description: memory.description,
      imageUrl: memory.image_url,
      createdAt: memory.created_at,
      createdBy: memory.created_by,
      tags: memory.tags,
      likes: memory.likes,
      comments: memory.comments,
    }));
  }

  // Share cabin information
  async shareCabinInfo(cabinId: string, cabinName: string): Promise<void> {
    const shareMessage = `Check out our family cabin "${cabinName}"! 🏡\n\n` +
      `We use OurCabin to coordinate our shared cabin experience. ` +
      `Download the app to see how we manage bookings, tasks, and family memories together.`;

    try {
      await Share.share({
        message: shareMessage,
        title: `Our Family Cabin: ${cabinName}`,
      });
    } catch (error) {
      console.error('Failed to share cabin info:', error);
      throw new Error('Failed to share cabin information');
    }
  }

  // Send family notification
  async sendFamilyNotification(
    cabinId: string,
    title: string,
    message: string,
    type: 'info' | 'warning' | 'celebration' = 'info'
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // In a real app, this would send push notifications to all family members
    console.log('Family notification:', { cabinId, title, message, type, from: user.id });
  }

  // Get family statistics
  async getFamilyStats(cabinId: string): Promise<{
    totalMembers: number;
    activeMembers: number;
    totalMemories: number;
    upcomingEvents: number;
  }> {
    const [members, memories, events] = await Promise.all([
      this.getFamilyMembers(cabinId),
      this.getFamilyMemories(cabinId),
      this.getFamilyEvents(cabinId),
    ]);

    const activeMembers = members.filter(member => {
      const lastActive = new Date(member.lastActive);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastActive > thirtyDaysAgo;
    }).length;

    const upcomingEvents = events.filter(event => 
      new Date(event.startDate) > new Date()
    ).length;

    return {
      totalMembers: members.length,
      activeMembers,
      totalMemories: memories.length,
      upcomingEvents,
    };
  }

  // Private helper methods
  private generateInviteCode(): string {
    return 'FAMILY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private getDefaultPermissions(role: string) {
    switch (role) {
      case 'owner':
        return {
          canCreatePosts: true,
          canCreateTasks: true,
          canApproveBookings: true,
          canManageMembers: true,
          canEditSettings: true,
        };
      case 'admin':
        return {
          canCreatePosts: true,
          canCreateTasks: true,
          canApproveBookings: true,
          canManageMembers: true,
          canEditSettings: false,
        };
      case 'member':
        return {
          canCreatePosts: true,
          canCreateTasks: true,
          canApproveBookings: false,
          canManageMembers: false,
          canEditSettings: false,
        };
      case 'guest':
        return {
          canCreatePosts: false,
          canCreateTasks: false,
          canApproveBookings: false,
          canManageMembers: false,
          canEditSettings: false,
        };
      default:
        return {
          canCreatePosts: false,
          canCreateTasks: false,
          canApproveBookings: false,
          canManageMembers: false,
          canEditSettings: false,
        };
    }
  }
}
