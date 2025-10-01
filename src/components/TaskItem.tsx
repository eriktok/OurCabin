import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../core/models';

interface Props {
  task: Task;
}

export const TaskItem: React.FC<Props> = ({ task }) => {
  return (
    <View style={styles.task}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.meta}>{task.status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  task: { padding: 12, borderRadius: 8, backgroundColor: '#f7fbff', borderWidth: 1, borderColor: '#e5f0ff' },
  taskTitle: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666', marginTop: 6 },
});


