export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  eventName: string;
  properties: Record<string, any>;
  userId?: string;
  cabinId?: string;
  sessionId: string;
}

export interface UserSession {
  id: string;
  startTime: string;
  endTime?: string;
  screenViews: string[];
  actions: string[];
  userId?: string;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private currentSession: UserSession | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline: boolean = true;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Initialize analytics
  initialize(userId?: string) {
    this.startSession(userId);
  }

  // Start a new session
  startSession(userId?: string) {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: new Date().toISOString(),
      screenViews: [],
      actions: [],
      userId,
    };
  }

  // End current session
  endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = new Date().toISOString();
      this.trackEvent('session_end', {
        duration: this.getSessionDuration(),
        screenViews: this.currentSession.screenViews.length,
        actions: this.currentSession.actions.length,
      });
    }
  }

  // Track screen view
  trackScreenView(screenName: string, properties: Record<string, any> = {}) {
    if (this.currentSession) {
      this.currentSession.screenViews.push(screenName);
    }

    this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  // Track user action
  trackAction(actionName: string, properties: Record<string, any> = {}) {
    if (this.currentSession) {
      this.currentSession.actions.push(actionName);
    }

    this.trackEvent('user_action', {
      action_name: actionName,
      ...properties,
    });
  }

  // Track custom event
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventName,
      properties,
      userId: this.currentSession?.userId,
      sessionId: this.currentSession?.id || '',
    };

    this.eventQueue.push(event);

    // Log in development
    if (__DEV__) {
      console.log('Analytics Event:', event);
    }

    // Send event if online
    if (this.isOnline) {
      this.sendEvent(event);
    }
  }

  // Track app-specific events
  trackPostCreated(postId: string, hasImage: boolean) {
    this.trackEvent('post_created', {
      post_id: postId,
      has_image: hasImage,
    });
  }

  trackTaskCreated(taskId: string, priority: string, assignedTo?: string) {
    this.trackEvent('task_created', {
      task_id: taskId,
      priority,
      assigned_to: assignedTo || null,
    });
  }

  trackBookingRequested(bookingId: string, duration: number) {
    this.trackEvent('booking_requested', {
      booking_id: bookingId,
      duration_days: duration,
    });
  }

  trackBookingApproved(bookingId: string) {
    this.trackEvent('booking_approved', {
      booking_id: bookingId,
    });
  }

  trackCabinJoined(cabinId: string, method: 'invite' | 'create') {
    this.trackEvent('cabin_joined', {
      cabin_id: cabinId,
      method,
    });
  }

  trackImageUploaded(imageId: string, size: number) {
    this.trackEvent('image_uploaded', {
      image_id: imageId,
      size_bytes: size,
    });
  }

  trackSearchPerformed(query: string, resultsCount: number) {
    this.trackEvent('search_performed', {
      query,
      results_count: resultsCount,
    });
  }

  trackErrorOccurred(error: string, context: string) {
    this.trackEvent('error_occurred', {
      error_message: error,
      context,
    });
  }

  // Send event to analytics service
  private async sendEvent(event: AnalyticsEvent) {
    try {
      // In a real app, this would send to your analytics service
      console.log('Sending analytics event:', event);
      
      // Remove from queue after successful send
      this.eventQueue = this.eventQueue.filter(e => e.id !== event.id);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Retry sending queued events
  async retryQueuedEvents() {
    if (this.eventQueue.length === 0) return;
    
    const eventsToRetry = [...this.eventQueue];
    this.eventQueue = [];
    
    for (const event of eventsToRetry) {
      await this.sendEvent(event);
    }
  }

  // Set network status
  setNetworkStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    
    if (isOnline) {
      this.retryQueuedEvents();
    }
  }

  // Get session duration
  private getSessionDuration(): number {
    if (!this.currentSession?.startTime) return 0;
    
    const start = new Date(this.currentSession.startTime);
    const end = new Date(this.currentSession.endTime || new Date());
    return Math.floor((end.getTime() - start.getTime()) / 1000);
  }

  // Generate unique IDs
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Get analytics summary
  getAnalyticsSummary() {
    return {
      currentSession: this.currentSession,
      queuedEvents: this.eventQueue.length,
      isOnline: this.isOnline,
    };
  }

  // Get user engagement metrics
  getUserEngagement() {
    if (!this.currentSession) return null;
    
    return {
      sessionDuration: this.getSessionDuration(),
      screenViews: this.currentSession.screenViews.length,
      actions: this.currentSession.actions.length,
      engagementScore: this.calculateEngagementScore(),
    };
  }

  private calculateEngagementScore(): number {
    if (!this.currentSession) return 0;
    
    const duration = this.getSessionDuration();
    const screenViews = this.currentSession.screenViews.length;
    const actions = this.currentSession.actions.length;
    
    // Simple engagement score calculation
    return Math.min(100, (duration * 0.1) + (screenViews * 5) + (actions * 2));
  }
}
