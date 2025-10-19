import { supabase } from '../../config/supabase';
import { Booking } from '../../core/models';
import { BaseSupabaseService } from './BaseSupabaseService';

/**
 * Handles all bookings operations with Supabase
 * Single Responsibility: Bookings only
 */
export class SupabaseBookingsService extends BaseSupabaseService {
  /**
   * Get bookings for a cabin
   */
  async getBookings(cabinId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          cabin_id,
          user_id,
          start_date,
          end_date,
          status,
          created_at
        `)
        .eq('cabin_id', cabinId)
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data.map(booking => ({
        id: booking.id,
        cabinId: booking.cabin_id,
        userId: booking.user_id,
        startDate: booking.start_date,
        endDate: booking.end_date,
        status: booking.status,
        createdAt: booking.created_at,
      }));
    } catch (error) {
      console.error('Get bookings error:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  /**
   * Request a new booking
   */
  async requestBooking(cabinId: string, range: { startDate: string; endDate: string }): Promise<Booking> {
    try {
      const user = await this.requireAuth();

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          cabin_id: cabinId,
          user_id: user.id,
          start_date: range.startDate,
          end_date: range.endDate,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        cabinId: data.cabin_id,
        userId: data.user_id,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Request booking error:', error);
      throw new Error('Failed to request booking');
    }
  }

  /**
   * Approve a booking
   */
  async approveBooking(bookingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'approved' })
        .eq('id', bookingId);

      if (error) throw error;
    } catch (error) {
      console.error('Approve booking error:', error);
      throw new Error('Failed to approve booking');
    }
  }

  /**
   * Reject a booking
   */
  async rejectBooking(bookingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', bookingId);

      if (error) throw error;
    } catch (error) {
      console.error('Reject booking error:', error);
      throw new Error('Failed to reject booking');
    }
  }
}
