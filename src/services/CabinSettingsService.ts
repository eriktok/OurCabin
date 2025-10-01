import { CabinSettings, CabinMember, CabinInvite } from '../core/models';
import { supabase } from '../config/supabase';

export class CabinSettingsService {
  private static instance: CabinSettingsService;

  static getInstance(): CabinSettingsService {
    if (!CabinSettingsService.instance) {
      CabinSettingsService.instance = new CabinSettingsService();
    }
    return CabinSettingsService.instance;
  }

  // Get cabin settings
  async getCabinSettings(cabinId: string): Promise<CabinSettings | null> {
    const { data, error } = await supabase
      .from('cabin_settings')
      .select('*')
      .eq('cabin_id', cabinId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return default settings
        return this.getDefaultSettings(cabinId);
      }
      throw error;
    }

    return this.mapToCabinSettings(data);
  }

  // Update cabin settings
  async updateCabinSettings(cabinId: string, settings: Partial<CabinSettings>): Promise<CabinSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user has permission to edit settings
    const hasPermission = await this.checkEditPermission(cabinId, user.id);
    if (!hasPermission) {
      throw new Error('You do not have permission to edit cabin settings');
    }

    const updateData = {
      cabin_id: cabinId,
      booking_settings: settings.bookingSettings,
      task_settings: settings.taskSettings,
      notification_settings: settings.notificationSettings,
      privacy_settings: settings.privacySettings,
      cabin_info: settings.cabinInfo,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('cabin_settings')
      .upsert(updateData)
      .select()
      .single();

    if (error) throw error;

    return this.mapToCabinSettings(data);
  }

  // Get cabin members
  async getCabinMembers(cabinId: string): Promise<CabinMember[]> {
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
      cabinId: member.cabin_id,
      userId: member.user_id,
      role: member.role,
      joinedAt: member.joined_at,
      invitedBy: member.invited_by,
      permissions: member.permissions,
    }));
  }

  // Add member to cabin
  async addCabinMember(cabinId: string, userId: string, role: 'admin' | 'member' | 'guest' = 'member'): Promise<CabinMember> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user has permission to add members
    const hasPermission = await this.checkManageMembersPermission(cabinId, user.id);
    if (!hasPermission) {
      throw new Error('You do not have permission to add members');
    }

    const memberData = {
      cabin_id: cabinId,
      user_id: userId,
      role,
      invited_by: user.id,
      permissions: this.getDefaultPermissions(role),
    };

    const { data, error } = await supabase
      .from('cabin_members')
      .insert(memberData)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      userId: data.user_id,
      role: data.role,
      joinedAt: data.joined_at,
      invitedBy: data.invited_by,
      permissions: data.permissions,
    };
  }

  // Remove member from cabin
  async removeCabinMember(cabinId: string, userId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user has permission to remove members
    const hasPermission = await this.checkManageMembersPermission(cabinId, user.id);
    if (!hasPermission) {
      throw new Error('You do not have permission to remove members');
    }

    // Prevent removing the cabin owner
    const member = await this.getCabinMember(cabinId, userId);
    if (member?.role === 'owner') {
      throw new Error('Cannot remove cabin owner');
    }

    const { error } = await supabase
      .from('cabin_members')
      .delete()
      .eq('cabin_id', cabinId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Update member role
  async updateMemberRole(cabinId: string, userId: string, newRole: 'admin' | 'member' | 'guest'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user has permission to update member roles
    const hasPermission = await this.checkManageMembersPermission(cabinId, user.id);
    if (!hasPermission) {
      throw new Error('You do not have permission to update member roles');
    }

    const { error } = await supabase
      .from('cabin_members')
      .update({
        role: newRole,
        permissions: this.getDefaultPermissions(newRole),
      })
      .eq('cabin_id', cabinId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Create cabin invite
  async createCabinInvite(cabinId: string, expiresInDays: number = 7, maxUses?: number): Promise<CabinInvite> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user has permission to create invites
    const hasPermission = await this.checkManageMembersPermission(cabinId, user.id);
    if (!hasPermission) {
      throw new Error('You do not have permission to create invites');
    }

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
    };
  }

  // Get cabin invites
  async getCabinInvites(cabinId: string): Promise<CabinInvite[]> {
    const { data, error } = await supabase
      .from('cabin_invites')
      .select('*')
      .eq('cabin_id', cabinId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(invite => ({
      id: invite.id,
      cabinId: invite.cabin_id,
      code: invite.code,
      expiresAt: invite.expires_at,
      maxUses: invite.max_uses,
      usedCount: invite.used_count,
      createdBy: invite.created_by,
      createdAt: invite.created_at,
      isActive: invite.is_active,
    }));
  }

  // Deactivate invite
  async deactivateInvite(inviteId: string): Promise<void> {
    const { error } = await supabase
      .from('cabin_invites')
      .update({ is_active: false })
      .eq('id', inviteId);

    if (error) throw error;
  }

  // Private helper methods
  private async getCabinMember(cabinId: string, userId: string): Promise<CabinMember | null> {
    const { data, error } = await supabase
      .from('cabin_members')
      .select('*')
      .eq('cabin_id', cabinId)
      .eq('user_id', userId)
      .single();

    if (error) return null;

    return {
      id: data.id,
      cabinId: data.cabin_id,
      userId: data.user_id,
      role: data.role,
      joinedAt: data.joined_at,
      invitedBy: data.invited_by,
      permissions: data.permissions,
    };
  }

  private async checkEditPermission(cabinId: string, userId: string): Promise<boolean> {
    const member = await this.getCabinMember(cabinId, userId);
    return member?.permissions?.canEditSettings || false;
  }

  private async checkManageMembersPermission(cabinId: string, userId: string): Promise<boolean> {
    const member = await this.getCabinMember(cabinId, userId);
    return member?.permissions?.canManageMembers || false;
  }

  private getDefaultSettings(cabinId: string): CabinSettings {
    return {
      id: `settings-${cabinId}`,
      cabinId,
      bookingSettings: {
        advanceBookingDays: 30,
        maxBookingDuration: 7,
        requireApproval: true,
        allowOverlapping: false,
        autoApproveMembers: false,
      },
      taskSettings: {
        allowTaskAssignment: true,
        requireTaskApproval: false,
        autoArchiveCompleted: true,
        archiveAfterDays: 30,
      },
      notificationSettings: {
        notifyOnNewPosts: true,
        notifyOnNewTasks: true,
        notifyOnBookingRequests: true,
        notifyOnTaskCompletion: true,
        notifyOnOverdueTasks: true,
        emailNotifications: true,
        pushNotifications: true,
      },
      privacySettings: {
        showMemberList: true,
        allowGuestPosts: false,
        requireApprovalForPosts: false,
        showBookingHistory: true,
      },
      cabinInfo: {
        description: '',
        location: '',
        capacity: 4,
        amenities: [],
        houseRules: [],
        emergencyContact: '',
        wifiPassword: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '',
    };
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

  private generateInviteCode(): string {
    return 'INVITE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private mapToCabinSettings(data: any): CabinSettings {
    return {
      id: data.id,
      cabinId: data.cabin_id,
      bookingSettings: data.booking_settings,
      taskSettings: data.task_settings,
      notificationSettings: data.notification_settings,
      privacySettings: data.privacy_settings,
      cabinInfo: data.cabin_info,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
    };
  }
}
