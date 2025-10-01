import { Alert } from 'react-native';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: any): AppError {
    console.error('App Error:', error);
    
    // Supabase errors
    if (error?.code) {
      return {
        message: error.message || 'Database error occurred',
        code: error.code,
        details: error.details,
      };
    }
    
    // Network errors
    if (error?.message?.includes('Network')) {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }
    
    // Generic errors
    return {
      message: error?.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
  
  static showAlert(error: AppError) {
    Alert.alert(
      'Error',
      error.message,
      [{ text: 'OK' }]
    );
  }
  
  static showNetworkError() {
    Alert.alert(
      'Connection Error',
      'Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  }
}
