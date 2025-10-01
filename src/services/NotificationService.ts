import { Platform, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export interface NotificationData {
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  static initialize() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        
        if (notification.userInteraction) {
          // Handle notification tap
          this.handleNotificationTap(notification);
        }
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions();
    }
  }

  static async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then((permissions) => {
        resolve(permissions.alert && permissions.badge && permissions.sound);
      });
    });
  }

  static scheduleLocalNotification(notification: NotificationData, delay: number = 0) {
    PushNotification.localNotificationSchedule({
      title: notification.title,
      message: notification.message,
      date: new Date(Date.now() + delay),
      userInfo: notification.data,
      soundName: 'default',
      playSound: true,
      vibrate: true,
    });
  }

  static sendLocalNotification(notification: NotificationData) {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.message,
      userInfo: notification.data,
      soundName: 'default',
      playSound: true,
      vibrate: true,
    });
  }

  static cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  static cancelNotification(id: string) {
    PushNotification.cancelLocalNotifications({ id });
  }

  static setApplicationIconBadgeNumber(number: number) {
    PushNotification.setApplicationIconBadgeNumber(number);
  }

  static getDeliveredNotifications() {
    return new Promise((resolve) => {
      PushNotification.getDeliveredNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  static removeDeliveredNotifications(identifiers: string[]) {
    PushNotification.removeDeliveredNotifications(identifiers);
  }

  private static handleNotificationTap(notification: any) {
    // Handle different notification types
    const { data } = notification;
    
    if (data?.type === 'task_update') {
      // Navigate to tasks screen
      console.log('Navigate to tasks screen');
    } else if (data?.type === 'booking_update') {
      // Navigate to calendar screen
      console.log('Navigate to calendar screen');
    } else if (data?.type === 'new_post') {
      // Navigate to logbook screen
      console.log('Navigate to logbook screen');
    }
  }

  // Specific notification methods for OurCabin
  static notifyTaskUpdate(taskTitle: string, status: string) {
    this.sendLocalNotification({
      title: 'Task Updated',
      message: `"${taskTitle}" is now ${status}`,
      data: { type: 'task_update', taskTitle, status },
    });
  }

  static notifyBookingRequest(cabinName: string, startDate: string, endDate: string) {
    this.sendLocalNotification({
      title: 'New Booking Request',
      message: `Booking request for ${cabinName} from ${startDate} to ${endDate}`,
      data: { type: 'booking_request', cabinName, startDate, endDate },
    });
  }

  static notifyBookingApproved(cabinName: string, startDate: string, endDate: string) {
    this.sendLocalNotification({
      title: 'Booking Approved',
      message: `Your booking for ${cabinName} from ${startDate} to ${endDate} has been approved`,
      data: { type: 'booking_approved', cabinName, startDate, endDate },
    });
  }

  static notifyNewPost(authorName: string, cabinName: string) {
    this.sendLocalNotification({
      title: 'New Post in Logbook',
      message: `${authorName} posted in ${cabinName}`,
      data: { type: 'new_post', authorName, cabinName },
    });
  }

  static notifyTaskAssigned(taskTitle: string, assignedBy: string) {
    this.sendLocalNotification({
      title: 'New Task Assigned',
      message: `"${taskTitle}" assigned by ${assignedBy}`,
      data: { type: 'task_assigned', taskTitle, assignedBy },
    });
  }
}
