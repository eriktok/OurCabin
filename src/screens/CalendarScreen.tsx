import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Booking } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, addDays, startOfDay, isAfter, isBefore } from 'date-fns';

export const CalendarScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 2),
  });
  const api = useCabinApi();

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

  const requestBooking = async () => {
    try {
      const created = await api.requestBooking('demo-cabin', {
        startDate: newBooking.startDate.toISOString(),
        endDate: newBooking.endDate.toISOString(),
      });
      setBookings(prev => [created, ...prev]);
      setShowRequestModal(false);
    } catch (error) {
      console.error('Failed to request booking:', error);
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

  const getStatusIcon = (status: string) => {
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
            <Icon name="plus" size={24} color="#2E7D32" />
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
                <Icon 
                  name={getStatusIcon(item.status || 'approved')} 
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
                  <Icon name="check" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => rejectBooking(item.id)}
                >
                  <Icon name="close" size={16} color="#fff" />
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
            <Icon name="calendar-outline" size={64} color="#ccc" />
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
                <Icon name="calendar" size={20} color="#2E7D32" />
                <Text style={styles.dateText}>
                  {format(newBooking.startDate, 'MMM dd, yyyy')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateSection}>
              <Text style={styles.sectionTitle}>End Date</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Icon name="calendar" size={20} color="#2E7D32" />
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
});


