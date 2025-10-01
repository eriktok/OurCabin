import { Alert } from 'react-native';
import { ErrorHandler } from '../utils/errorHandler';

export interface ErrorReport {
  id: string;
  timestamp: string;
  error: Error;
  context: {
    screen?: string;
    action?: string;
    userId?: string;
    cabinId?: string;
  };
  userAgent: string;
  appVersion: string;
}

export class ErrorReportingService {
  private static instance: ErrorReportingService;
  private errorQueue: ErrorReport[] = [];
  private isOnline: boolean = true;

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  // Report an error with context
  reportError(error: Error, context: ErrorReport['context'] = {}) {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      error,
      context,
      userAgent: 'React Native App',
      appVersion: '1.0.0',
    };

    this.errorQueue.push(errorReport);
    
    // Log to console in development
    if (__DEV__) {
      console.error('Error Report:', errorReport);
    }

    // Show user-friendly error message
    this.showUserFriendlyError(error, context);

    // Try to send error report if online
    if (this.isOnline) {
      this.sendErrorReport(errorReport);
    }
  }

  // Show user-friendly error messages
  private showUserFriendlyError(error: Error, context: ErrorReport['context']) {
    const errorMessage = this.getUserFriendlyMessage(error, context);
    
    Alert.alert(
      'Something went wrong',
      errorMessage,
      [
        { text: 'OK', style: 'default' },
        { text: 'Report Issue', onPress: () => this.showReportDialog(error, context) },
      ]
    );
  }

  // Get user-friendly error messages
  private getUserFriendlyMessage(error: Error, context: ErrorReport['context']): string {
    const errorMessage = error.message.toLowerCase();
    
    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Please check your internet connection and try again.';
    }
    
    // Authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      return 'Please sign in again to continue.';
    }
    
    // Permission errors
    if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    // Validation errors
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return 'Please check your input and try again.';
    }
    
    // Context-specific messages
    if (context.action) {
      switch (context.action) {
        case 'create_post':
          return 'Failed to create post. Please try again.';
        case 'create_task':
          return 'Failed to create task. Please try again.';
        case 'request_booking':
          return 'Failed to request booking. Please try again.';
        case 'upload_image':
          return 'Failed to upload image. Please try again.';
        default:
          return 'An unexpected error occurred. Please try again.';
      }
    }
    
    // Generic fallback
    return 'An unexpected error occurred. Please try again.';
  }

  // Show error reporting dialog
  private showReportDialog(error: Error, context: ErrorReport['context']) {
    Alert.alert(
      'Report Issue',
      'Would you like to report this issue to help us improve the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', onPress: () => this.submitErrorReport(error, context) },
      ]
    );
  }

  // Submit error report
  private async submitErrorReport(error: Error, context: ErrorReport['context']) {
    try {
      // In a real app, this would send to your error reporting service
      // For now, we'll just log it
      console.log('Error report submitted:', { error, context });
      
      Alert.alert(
        'Thank you',
        'Your error report has been submitted. We\'ll look into this issue.',
        [{ text: 'OK' }]
      );
    } catch (reportError) {
      console.error('Failed to submit error report:', reportError);
    }
  }

  // Send error report to server
  private async sendErrorReport(errorReport: ErrorReport) {
    try {
      // In a real app, this would send to your backend
      console.log('Sending error report:', errorReport);
      
      // Remove from queue after successful send
      this.errorQueue = this.errorQueue.filter(report => report.id !== errorReport.id);
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  // Retry sending queued errors
  async retryQueuedErrors() {
    if (this.errorQueue.length === 0) return;
    
    const errorsToRetry = [...this.errorQueue];
    this.errorQueue = [];
    
    for (const errorReport of errorsToRetry) {
      await this.sendErrorReport(errorReport);
    }
  }

  // Set network status
  setNetworkStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    
    if (isOnline) {
      this.retryQueuedErrors();
    }
  }

  // Generate unique error ID
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Get error statistics
  getErrorStats() {
    return {
      totalErrors: this.errorQueue.length,
      recentErrors: this.errorQueue.filter(
        error => new Date(error.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
    };
  }
}
