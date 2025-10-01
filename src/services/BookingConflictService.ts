import { supabase } from '../config/supabase';
import { Booking } from '../core/models';

export interface BookingConflict {
  type: 'overlap' | 'adjacent' | 'same_day';
  conflictingBooking: Booking;
  severity: 'warning' | 'error';
  message: string;
}

export class BookingConflictService {
  private static instance: BookingConflictService;

  static getInstance(): BookingConflictService {
    if (!BookingConflictService.instance) {
      BookingConflictService.instance = new BookingConflictService();
    }
    return BookingConflictService.instance;
  }

  async checkConflicts(
    cabinId: string, 
    startDate: string, 
    endDate: string, 
    excludeBookingId?: string
  ): Promise<BookingConflict[]> {
    const conflicts: BookingConflict[] = [];

    // Get all approved bookings for the cabin
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('cabin_id', cabinId)
      .eq('status', 'approved')
      .neq('id', excludeBookingId || '');

    if (error) throw error;

    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);

    for (const booking of bookings || []) {
      const existingStart = new Date(booking.start_date);
      const existingEnd = new Date(booking.end_date);

      // Check for direct overlap
      if (this.hasOverlap(requestedStart, requestedEnd, existingStart, existingEnd)) {
        conflicts.push({
          type: 'overlap',
          conflictingBooking: {
            id: booking.id,
            cabinId: booking.cabin_id,
            userId: booking.user_id,
            startDate: booking.start_date,
            endDate: booking.end_date,
            createdAt: booking.created_at,
            status: booking.status,
          },
          severity: 'error',
          message: `Conflicts with existing booking from ${this.formatDate(existingStart)} to ${this.formatDate(existingEnd)}`,
        });
      }
      // Check for adjacent bookings (same day check-in/out)
      else if (this.isAdjacent(requestedStart, requestedEnd, existingStart, existingEnd)) {
        conflicts.push({
          type: 'adjacent',
          conflictingBooking: {
            id: booking.id,
            cabinId: booking.cabin_id,
            userId: booking.user_id,
            startDate: booking.start_date,
            endDate: booking.end_date,
            createdAt: booking.created_at,
            status: booking.status,
          },
          severity: 'warning',
          message: `Adjacent to existing booking from ${this.formatDate(existingStart)} to ${this.formatDate(existingEnd)}`,
        });
      }
      // Check for same day bookings
      else if (this.isSameDay(requestedStart, requestedEnd, existingStart, existingEnd)) {
        conflicts.push({
          type: 'same_day',
          conflictingBooking: {
            id: booking.id,
            cabinId: booking.cabin_id,
            userId: booking.user_id,
            startDate: booking.start_date,
            endDate: booking.end_date,
            createdAt: booking.created_at,
            status: booking.status,
          },
          severity: 'warning',
          message: `Same day as existing booking from ${this.formatDate(existingStart)} to ${this.formatDate(existingEnd)}`,
        });
      }
    }

    return conflicts;
  }

  async getAvailableDates(cabinId: string, month: number, year: number): Promise<Date[]> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    // Get all approved bookings for the month
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('cabin_id', cabinId)
      .eq('status', 'approved')
      .gte('start_date', startOfMonth.toISOString())
      .lte('end_date', endOfMonth.toISOString());

    if (error) throw error;

    const bookedDates = new Set<string>();
    
    // Mark all booked dates
    for (const booking of bookings || []) {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        bookedDates.add(d.toISOString().split('T')[0]);
      }
    }

    // Find available dates
    const availableDates: Date[] = [];
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      if (!bookedDates.has(dateString)) {
        availableDates.push(new Date(d));
      }
    }

    return availableDates;
  }

  async suggestAlternativeDates(
    cabinId: string, 
    preferredStartDate: string, 
    preferredEndDate: string,
    maxSuggestions: number = 3
  ): Promise<{ startDate: string; endDate: string; daysDiff: number }[]> {
    const preferredStart = new Date(preferredStartDate);
    const preferredEnd = new Date(preferredEndDate);
    const duration = Math.ceil((preferredEnd.getTime() - preferredStart.getTime()) / (1000 * 60 * 60 * 24));

    const suggestions: { startDate: string; endDate: string; daysDiff: number }[] = [];
    
    // Check dates within 30 days before and after
    for (let offset = -30; offset <= 30; offset++) {
      if (suggestions.length >= maxSuggestions) break;

      const suggestedStart = new Date(preferredStart);
      suggestedStart.setDate(suggestedStart.getDate() + offset);
      
      const suggestedEnd = new Date(suggestedStart);
      suggestedEnd.setDate(suggestedEnd.getDate() + duration);

      // Check if this period is available
      const conflicts = await this.checkConflicts(
        cabinId, 
        suggestedStart.toISOString(), 
        suggestedEnd.toISOString()
      );

      if (conflicts.length === 0) {
        suggestions.push({
          startDate: suggestedStart.toISOString(),
          endDate: suggestedEnd.toISOString(),
          daysDiff: Math.abs(offset),
        });
      }
    }

    return suggestions.sort((a, b) => a.daysDiff - b.daysDiff);
  }

  private hasOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && start2 < end1;
  }

  private isAdjacent(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    const oneDay = 24 * 60 * 60 * 1000;
    return (
      Math.abs(start1.getTime() - end2.getTime()) < oneDay ||
      Math.abs(end1.getTime() - start2.getTime()) < oneDay
    );
  }

  private isSameDay(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return (
      this.isSameDate(start1, start2) ||
      this.isSameDate(start1, end2) ||
      this.isSameDate(end1, start2) ||
      this.isSameDate(end1, end2)
    );
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
