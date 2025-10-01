import { useAppStore } from '../stores/appStore';
import { Post, Task, Booking } from '../core/models';

// Safe storage implementation
const createSafeStorage = () => {
  let storage: any;
  
  try {
    storage = require('@react-native-async-storage/async-storage').default;
    console.log('OfflineService: Using AsyncStorage');
  } catch (error) {
    console.warn('OfflineService: AsyncStorage not available, using fallback storage');
    const memoryStorage: Record<string, string> = {};
    storage = {
      getItem: async (key: string) => memoryStorage[key] || null,
      setItem: async (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: async (key: string) => { delete memoryStorage[key]; },
      getAllKeys: async () => Object.keys(memoryStorage),
      multiRemove: async (keys: string[]) => keys.forEach(key => delete memoryStorage[key]),
    };
  }
  
  return storage;
};

const AsyncStorage = createSafeStorage();

const OFFLINE_QUEUE_KEY = 'offline_queue';
const SYNC_TIMESTAMP_KEY = 'last_sync_timestamp';

export interface OfflineAction {
  id: string;
  type: 'create_post' | 'create_task' | 'update_task' | 'create_booking' | 'update_booking';
  data: any;
  timestamp: string;
  retryCount: number;
}

export class OfflineService {
  static async addToQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    try {
      const queue = await this.getQueue();
      const newAction: OfflineAction = {
        ...action,
        id: Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };
      
      queue.push(newAction);
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to add action to offline queue:', error);
    }
  }

  static async getQueue(): Promise<OfflineAction[]> {
    try {
      const queueData = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Failed to get offline queue:', error);
      return [];
    }
  }

  static async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear offline queue:', error);
    }
  }

  static async removeAction(actionId: string): Promise<void> {
    try {
      const queue = await this.getQueue();
      const filteredQueue = queue.filter(action => action.id !== actionId);
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('Failed to remove action from queue:', error);
    }
  }

  static async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(SYNC_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  }

  static async setLastSyncTime(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
    } catch (error) {
      console.error('Failed to set last sync time:', error);
    }
  }

  static async cacheData<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  static async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(`cache_${key}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Check if cache is less than 1 hour old
        const cacheAge = Date.now() - new Date(parsed.timestamp).getTime();
        if (cacheAge < 60 * 60 * 1000) {
          return parsed.data;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }

  static async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}
