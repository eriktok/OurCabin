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
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  list: { gap: 8 },
  booking: { padding: 12, borderRadius: 8, backgroundColor: '#fff9f3', borderWidth: 1, borderColor: '#ffedd5' },
  range: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666', marginTop: 6 },
  status: { fontSize: 12, color: '#444', marginTop: 6 },
  row: { marginBottom: 12 },
});


