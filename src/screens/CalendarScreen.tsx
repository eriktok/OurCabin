import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Booking } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafeIcon } from '../components/ui/SafeIcon';
import { BookingConflictService, BookingConflict } from '../services/BookingConflictService';
import { format, addDays, startOfDay, isAfter, isBefore } from 'date-fns';

export const CalendarScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 2),
  });
  const [conflicts, setConflicts] = useState<BookingConflict[]>([]);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [alternativeDates, setAlternativeDates] = useState<{ startDate: string; endDate: string; daysDiff: number }[]>([]);
  const api = useCabinApi();
  const conflictService = BookingConflictService.getInstance();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const allBookings = await api.getBookings('demo-cabin');
      setBookings(allBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const checkConflicts = async () => {
    setIsCheckingConflicts(true);
    try {
      const detectedConflicts = await conflictService.checkConflicts(
        'demo-cabin',
        newBooking.startDate.toISOString(),
        newBooking.endDate.toISOString()
      );
      setConflicts(detectedConflicts);

      if (detectedConflicts.some(c => c.severity === 'error')) {
        // Get alternative dates
        const alternatives = await conflictService.suggestAlternativeDates(
          'demo-cabin',
          newBooking.startDate.toISOString(),
          newBooking.endDate.toISOString()
        );
        setAlternativeDates(alternatives);
      }
    } catch (error) {
      console.error('Failed to check conflicts:', error);
    } finally {
      setIsCheckingConflicts(false);
    }
  };

  const requestBooking = async () => {
    try {
      // Check for conflicts first
      const detectedConflicts = await conflictService.checkConflicts(
        'demo-cabin',
        newBooking.startDate.toISOString(),
        newBooking.endDate.toISOString()
      );

      const hasErrors = detectedConflicts.some(c => c.severity === 'error');
      
      if (hasErrors) {
        Alert.alert(
          'Booking Conflict',
          'This booking conflicts with existing reservations. Please choose different dates.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Check Alternatives', onPress: checkConflicts },
          ]
        );
        return;
      }

      const created = await api.requestBooking('demo-cabin', {
        startDate: newBooking.startDate.toISOString(),
        endDate: newBooking.endDate.toISOString(),
      });
      setBookings(prev => [created, ...prev]);
      setShowRequestModal(false);
      setConflicts([]);
      setAlternativeDates([]);
    } catch (error) {
      console.error('Failed to request booking:', error);
      Alert.alert('Error', 'Failed to create booking request. Please try again.');
    }
  };

  const approveBooking = async (bookingId: string) => {
    try {
      await api.approveBooking(bookingId);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'approved' } : b
      ));
    } catch (error) {
      console.error('Failed to approve booking:', error);
    }
  };

  const rejectBooking = async (bookingId: string) => {
    try {
      await api.rejectBooking(bookingId);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'rejected' } : b
      ));
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#2E7D32';
      case 'pending': return '#ED6C02';
      case 'rejected': return '#D32F2F';
      default: return '#666';
    }
  };

  const getStatusSafeIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'check-circle';
      case 'pending': return 'clock-outline';
      case 'rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Calendar" 
        right={
          <TouchableOpacity onPress={() => setShowRequestModal(true)}>
            <SafeIcon name="plus" size={24} color="#2E7D32" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <Text style={styles.dateRange}>
                  {format(new Date(item.startDate), 'MMM dd')} - {format(new Date(item.endDate), 'MMM dd, yyyy')}
                </Text>
                <Text style={styles.bookingUser}>Requested by {item.userId}</Text>
              </View>
              <View style={styles.statusContainer}>
                <SafeIcon 
                  name={getStatusSafeIcon(item.status || 'approved')} 
                  size={20} 
                  color={getStatusColor(item.status || 'approved')} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(item.status || 'approved') }]}>
                  {item.status || 'approved'}
                </Text>
              </View>
            </View>
            
            {(item.status === 'pending') && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => approveBooking(item.id)}
                >
                  <SafeIcon name="check" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => rejectBooking(item.id)}
                >
                  <SafeIcon name="close" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <SafeIcon name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>Request your first cabin stay!</Text>
          </View>
        }
      />

      <Modal visible={showRequestModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowRequestModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Request Booking</Text>
            <PrimaryButton
              title="Request"
              onPress={requestBooking}
              style={styles.requestButton}
            />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.dateSection}>
              <Text style={styles.sectionTitle}>Start Date</Text>
              <TouchableOpacity style={styles.dateButton}>
                <SafeIcon name="calendar" size={20} color="#2E7D32" />
                <Text style={styles.dateText}>
                  {format(newBooking.startDate, 'MMM dd, yyyy')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateSection}>
              <Text style={styles.sectionTitle}>End Date</Text>
              <TouchableOpacity style={styles.dateButton}>
                <SafeIcon name="calendar" size={20} color="#2E7D32" />
                <Text style={styles.dateText}>
                  {format(newBooking.endDate, 'MMM dd, yyyy')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bookingSummary}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <Text style={styles.summaryText}>
                {Math.ceil((newBooking.endDate.getTime() - newBooking.startDate.getTime()) / (1000 * 60 * 60 * 24))} nights
              </Text>
            </View>

            {/* Conflict Detection */}
            <TouchableOpacity 
              style={styles.checkConflictsButton} 
              onPress={checkConflicts}
              disabled={isCheckingConflicts}
            >
              <SafeIcon name="shield-check" size={20} color="#2E7D32" />
              <Text style={styles.checkConflictsText}>
                {isCheckingConflicts ? 'Checking...' : 'Check for Conflicts'}
              </Text>
            </TouchableOpacity>

            {/* Display Conflicts */}
            {conflicts.length > 0 && (
              <View style={styles.conflictsContainer}>
                <Text style={styles.conflictsTitle}>⚠️ Booking Conflicts Detected</Text>
                {conflicts.map((conflict, index) => (
                  <View key={index} style={[
                    styles.conflictItem,
                    conflict.severity === 'error' ? styles.conflictError : styles.conflictWarning
                  ]}>
                    <SafeIcon 
                      name={conflict.severity === 'error' ? 'alert-circle' : 'alert'} 
                      size={16} 
                      color={conflict.severity === 'error' ? '#D32F2F' : '#FF9800'} 
                    />
                    <Text style={styles.conflictText}>{conflict.message}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Alternative Dates */}
            {alternativeDates.length > 0 && (
              <View style={styles.alternativesContainer}>
                <Text style={styles.alternativesTitle}>💡 Suggested Alternative Dates</Text>
                {alternativeDates.slice(0, 3).map((alt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.alternativeItem}
                    onPress={() => {
                      setNewBooking({
                        startDate: new Date(alt.startDate),
                        endDate: new Date(alt.endDate),
                      });
                      setConflicts([]);
                      setAlternativeDates([]);
                    }}
                  >
                    <SafeIcon name="calendar-check" size={16} color="#2E7D32" />
                    <Text style={styles.alternativeText}>
                      {format(new Date(alt.startDate), 'MMM dd')} - {format(new Date(alt.endDate), 'MMM dd, yyyy')}
                      {alt.daysDiff > 0 && ` (${alt.daysDiff} days ${alt.startDate < newBooking.startDate.toISOString() ? 'earlier' : 'later'})`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F8FA' 
  },
  list: { 
    paddingBottom: 16 
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  dateRange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1F2C',
    marginBottom: 4,
  },
  bookingUser: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#2E7D32',
  },
  rejectButton: {
    backgroundColor: '#D32F2F',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F2C',
  },
  requestButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1F2C',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#1A1F2C',
    fontWeight: '500',
  },
  bookingSummary: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  checkConflictsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 16,
    gap: 8,
  },
  checkConflictsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  conflictsContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  conflictsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 12,
  },
  conflictItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
    gap: 8,
  },
  conflictError: {
    backgroundColor: '#FFEBEE',
  },
  conflictWarning: {
    backgroundColor: '#FFF8E1',
  },
  conflictText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  alternativesContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
});


