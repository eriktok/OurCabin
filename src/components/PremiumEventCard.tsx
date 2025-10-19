import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Chip, IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Animated } from 'react-native';

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: 'booking' | 'task' | 'post';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface PremiumEventCardProps {
  event: UpcomingEvent;
  opacity: Animated.Value;
}

export const PremiumEventCard: React.FC<PremiumEventCardProps> = ({ event, opacity }) => {
  const theme = useTheme();

  const getEventIcon = () => {
    switch (event.type) {
      case 'booking': return '🏠';
      case 'task': return '✅';
      case 'post': return '📝';
      default: return '📅';
    }
  };

  const getPriorityColor = () => {
    switch (event.priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return theme.colors.primary;
    }
  };

  return (
    <Animated.View style={[styles.eventCard, { opacity }]}>
      <Surface style={styles.eventSurface} elevation={1}>
        <View style={styles.eventContent}>
          <View style={[styles.eventIconContainer, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.eventIcon}>{getEventIcon()}</Text>
          </View>
          <View style={styles.eventTextContainer}>
            <View style={styles.eventHeader}>
              <Text variant="titleMedium" style={styles.eventTitle}>
                {event.title}
              </Text>
              <Chip 
                mode="outlined" 
                compact 
                style={[styles.priorityChip, { borderColor: getPriorityColor() }]}
                textStyle={{ color: getPriorityColor(), fontSize: 10 }}
              >
                {event.priority}
              </Chip>
            </View>
            <Text variant="bodyMedium" style={styles.eventDescription}>
              {event.description}
            </Text>
            <Text variant="bodySmall" style={styles.eventDate}>
              {event.date}
            </Text>
          </View>
          <IconButton
            icon="chevron-right"
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </Surface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: 8,
  },
  eventSurface: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventIcon: {
    fontSize: 20,
  },
  eventTextContainer: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  priorityChip: {
    marginLeft: 8,
    height: 24,
  },
  eventDescription: {
    color: '#666',
    marginBottom: 4,
  },
  eventDate: {
    color: '#999',
    fontSize: 12,
  },
});
