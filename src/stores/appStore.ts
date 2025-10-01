import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Cabin, Post, Task, Booking } from '../core/models';

// Safe storage implementation
const createSafeStorage = () => {
  let storage: any;
  
  try {
    // Try to import AsyncStorage
    storage = require('@react-native-async-storage/async-storage').default;
    console.log('Using AsyncStorage');
  } catch (error) {
    console.warn('AsyncStorage not available, using fallback storage');
    // Fallback to in-memory storage
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

const safeStorage = createSafeStorage();

interface AppState {
  // User state
  currentUser: User | null;
  selectedCabin: Cabin | null;
  
  // Data cache
  posts: Post[];
  tasks: Task[];
  bookings: Booking[];
  
  // UI state
  isOnline: boolean;
  lastSyncTime: string | null;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setSelectedCabin: (cabin: Cabin | null) => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setLastSyncTime: (time: string) => void;
  clearCache: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      selectedCabin: null,
      posts: [],
      tasks: [],
      bookings: [],
      isOnline: true,
      lastSyncTime: null,

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setSelectedCabin: (cabin) => set({ selectedCabin: cabin }),

      // Posts actions
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      updatePost: (postId, updates) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId ? { ...post, ...updates } : post
        )
      })),

      // Tasks actions
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),

      // Bookings actions
      setBookings: (bookings) => set({ bookings }),
      addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
      updateBooking: (bookingId, updates) => set((state) => ({
        bookings: state.bookings.map(booking => 
          booking.id === bookingId ? { ...booking, ...updates } : booking
        )
      })),

      // Network actions
      setOnlineStatus: (isOnline) => set({ isOnline }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      // Cache management
      clearCache: () => set({
        posts: [],
        tasks: [],
        bookings: [],
        selectedCabin: null,
        lastSyncTime: null,
      }),
    }),
    {
      name: 'ourcabin-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        selectedCabin: state.selectedCabin,
        posts: state.posts,
        tasks: state.tasks,
        bookings: state.bookings,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
