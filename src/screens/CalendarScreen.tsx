import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Booking } from '../core/models';
import { cabinApiService } from '../services/SupabaseService';

export const CalendarScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    cabinApiService.getBookings('demo-cabin').then(setBookings).catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => (
          <View style={styles.booking}>
            <Text style={styles.range}>
              {new Date(item.startDate).toDateString()} → {new Date(item.endDate).toDateString()}
            </Text>
            <Text style={styles.meta}>Booked by {item.userId}</Text>
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
});


