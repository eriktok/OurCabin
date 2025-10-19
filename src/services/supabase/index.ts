/**
 * Supabase Services Index
 * Clean exports following the established directory structure
 */

// Base service
export { BaseSupabaseService } from './BaseSupabaseService';

// Domain services
export { SupabaseAuthService } from './SupabaseAuthService';
export { SupabasePostsService } from './SupabasePostsService';
export { SupabaseTasksService } from './SupabaseTasksService';
export { SupabaseBookingsService } from './SupabaseBookingsService';
export { SupabaseCabinsService } from './SupabaseCabinsService';

// Composed service (main service)
export { ComposedSupabaseService, composedSupabaseService } from './ComposedSupabaseService';
