export interface CabinSettings {
  id: string;
  cabinId: string;
  
  // Booking Settings
  bookingSettings: {
    advanceBookingDays: number; // How many days in advance can bookings be made
    maxBookingDuration: number; // Maximum number of days for a single booking
    requireApproval: boolean; // Whether bookings need approval
    allowOverlapping: boolean; // Whether overlapping bookings are allowed
    autoApproveMembers: boolean; // Auto-approve bookings from cabin members
  };
  
  // Task Settings
  taskSettings: {
    allowTaskAssignment: boolean; // Whether tasks can be assigned to specific users
    requireTaskApproval: boolean; // Whether completed tasks need approval
    autoArchiveCompleted: boolean; // Auto-archive completed tasks after X days
    archiveAfterDays: number; // Days after which to archive completed tasks
  };
  
  // Notification Settings
  notificationSettings: {
    notifyOnNewPosts: boolean;
    notifyOnNewTasks: boolean;
    notifyOnBookingRequests: boolean;
    notifyOnTaskCompletion: boolean;
    notifyOnOverdueTasks: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  
  // Privacy Settings
  privacySettings: {
    showMemberList: boolean; // Whether to show cabin member list to all members
    allowGuestPosts: boolean; // Whether guests can create posts
    requireApprovalForPosts: boolean; // Whether posts need approval before being visible
    showBookingHistory: boolean; // Whether to show booking history to all members
  };
  
  // Cabin Information
  cabinInfo: {
    description?: string;
    location?: string;
    capacity?: number;
    amenities?: string[];
    houseRules?: string[];
    emergencyContact?: string;
    wifiPassword?: string;
  };
  
  // Created/Updated timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CabinMember {
  id: string;
  cabinId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
  invitedBy: string;
  permissions: {
    canCreatePosts: boolean;
    canCreateTasks: boolean;
    canApproveBookings: boolean;
    canManageMembers: boolean;
    canEditSettings: boolean;
  };
}

export interface CabinInvite {
  id: string;
  cabinId: string;
  code: string;
  expiresAt: string;
  maxUses?: number;
  usedCount: number;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}
