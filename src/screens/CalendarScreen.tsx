import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { Booking } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';

export const CalendarScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const api = useCabinApi();

  useEffect(() => {
    api.getBookings('demo-cabin').then(setBookings).catch(console.error);
  }, [api]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>
      <View style={styles.row}>
        <Button
          title="Request 2-day booking from today"
          onPress={async () => {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
            const created = await api.requestBooking('demo-cabin', {
              startDate: start.toISOString(),
              endDate: end.toISOString(),
            });
            setBookings((b) => [created, ...b]);
          }}
        />
      </View>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => (
          <View style={styles.booking}>
            <Text style={styles.range}>
              {new Date(item.startDate).toDateString()} → {new Date(item.endDate).toDateString()}
            </Text>
            <Text style={styles.meta}>Booked by {item.userId}</Text>
            <Text style={styles.status}>Status: {item.status ?? 'approved'}</Text>
            {item.status === 'pending' && (
              <Button
                title="Approve"
                onPress={async () => {
                  await api.approveBooking(item.id);
                  setBookings((prev) => prev.map((b) => (b.id === item.id ? { ...b, status: 'approved' } : b)));
                }}
              />
            )}
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#2c3e50' },
  list: { gap: 12 },
  booking: { 
    padding: 16, 
    borderRadius: 12, 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  range: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  meta: { fontSize: 12, color: '#6c757d', marginTop: 8, fontWeight: '500' },
  status: { fontSize: 12, color: '#495057', marginTop: 8, fontWeight: '600' },
  row: { 
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});


