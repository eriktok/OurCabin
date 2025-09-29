## Application Specification: Our Cabin

1. Vision Statement
   For families and groups who co-own a cabin, Our Cabin is a private mobile platform that simplifies communication, scheduling, and property management. It replaces disorganized group chats and spreadsheets with a single, organized hub to coordinate tasks, share memories, and reduce the friction of shared ownership.

2. Core Features (Functional Requirements)
   F1: Onboarding & Cabin Management

Description: A secure and simple process for users to sign up and create or join their private cabin space.

User Stories:

As a user, I can sign up or log in seamlessly using my Google account.

As a user in Norway, I can sign up or log in securely using Vipps.

As a first-time user, I can create a "Cabin" space by giving it a name and an optional photo.

As the creator of a cabin, I am assigned an Admin role.

As an Admin, I can generate a unique, secure invitation code to share with other members.

As a new member, I can join an existing cabin space by entering the invitation code.

F2: The Logbook (Shared Feed)

Description: A central, chronological feed for all members to post updates, share photos, and communicate, creating a living history of the cabin.

User Stories:

As a member, I can write a text post to the Logbook for everyone to see.

As a member, I can attach one or more photos from my phone's gallery or camera to a post.

As a member, I can view all posts in a scrollable feed, with the newest appearing first.

As a member, I can add comments to posts to have a threaded conversation.

As a member, I can add a "like" or other simple reactions to posts and comments.

F3: Task Manager ("To-Do" List)

Description: A collaborative tool to track maintenance, chores, and supplies needed for the cabin.

User Stories:

As a member, I can create a new task with a title and an optional description (e.g., "Fix the leaky faucet," "Restock firewood").

As a member, I can view all tasks organized into lists like "To Do," "In Progress," and "Done."

As a member, I can mark a task as complete, which moves it to the "Done" list and notifies the group.

(Post-MVP) As a member, I can assign tasks to specific people and set due dates.

F4: Booking Calendar

Description: A shared calendar to reserve stays, view availability, and prevent scheduling conflicts.

User Stories:

As a member, I can view a calendar showing which dates are booked and which are available.

As a member, I can select a start and end date to request a new booking for myself or my family.

As a member, I can see who has booked the cabin for any given date.

As an Admin, I can approve booking requests (if enabled) and block out dates for maintenance.

## Technical Specification

1. Architecture & Technology Stack
   Platform: React Native with TypeScript. The application will be built from a single codebase for both iOS and Android.

State Management: Zustand or Redux Toolkit for managing global application state like user authentication and cabin data.

Architecture: The application will strictly adhere to the Repository Pattern to create an abstraction layer between the UI/business logic and the data source. This ensures the backend is swappable in the future.

2. Frontend Details
   Language: TypeScript for type safety and improved developer experience.

UI Toolkit: React Native Paper or Tamagui for a high-quality, pre-built component library to accelerate development.

Navigation: React Navigation for handling all screen transitions and app navigation logic.

Data Fetching: A client like TanStack Query (React Query) will be used to manage server state, caching, and background data synchronization.

3. Backend & Data Layer (MVP)
   Backend-as-a-Service (BaaS): Supabase will be used for its PostgreSQL foundation, authentication, and storage capabilities.

Database: Supabase (PostgreSQL) for storing structured relational data (users, cabins, tasks, etc.).

Authentication: Supabase Auth. It will integrate with the Google Sign-In SDK and the Vipps Login API for user identity.

Storage: Supabase Storage for hosting all user-uploaded images securely.

4. The Repository Pattern Implementation
   The core of the architecture is the API Service Interface. This contract will define all possible data operations, making the application backend-agnostic.

src/core/services/ICabinApiService.ts (The Interface - Unchanged)

TypeScript

// Defines the contract for any data source implementation
// Models
import { User, Task, Post, Booking } from '../models';

export interface ICabinApiService {
// Auth
signInWithGoogle(): Promise<User>;
signInWithVipps(): Promise<User>;
signOut(): Promise<void>;
onAuthStateChanged(callback: (user: User | null) => void): () => void; // Unsubscribe function

// Posts (Logbook)
getPosts(cabinId: string, limit: number): Promise<Post[]>;
createPost(cabinId: string, postData: { text: string; imageUrls?: string[] }): Promise<Post>;

// Tasks
getTasks(cabinId: string): Promise<Task[]>;
createTask(cabinId: string, taskData: { title: string; description?: string }): Promise<Task>;
updateTask(taskId: string, updates: Partial<Task>): Promise<void>;
}
src/services/SupabaseService.ts (The Concrete Implementation - Updated)

TypeScript

import { ICabinApiService } from '../core/services/ICabinApiService';
import { supabase } from '../supabaseClient'; // Assumes a configured Supabase client
import { Post } from '../core/models';

export class SupabaseService implements ICabinApiService {
async getPosts(cabinId: string, limit: number): Promise<Post[]> {
const { data, error } = await supabase
.from('posts') // Assumes a 'posts' table
.select('\*')
.eq('cabin_id', cabinId) // Assumes a foreign key linking posts to cabins
.order('created_at', { ascending: false })
.limit(limit);

    if (error) {
      console.error("Error fetching posts:", error.message);
      throw error;
    }

    return data || [];

}

// ... implement all other methods from the interface using the Supabase client
}
The React components will only ever interact with ICabinApiService, never directly with SupabaseService.

## Non-Functional Requirements

Usability: The UI must be exceptionally simple and intuitive, catering to a wide range of ages and tech literacy.

Performance: The app must load quickly and feel responsive. Images should be optimized, and data should be cached locally for faster repeat-views and basic offline access (e.g., viewing already-loaded tasks).

Security: All data transmission must be over HTTPS. Sensitive keys and user tokens must be stored securely in the device's keychain. Invitation codes should be single-use or time-limited.
