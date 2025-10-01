import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { Task } from '../core/models';
import { cabinApiService } from '../services/SupabaseService';

export const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    cabinApiService.getTasks('demo-cabin').then(setTasks).catch(console.error);
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const task = await cabinApiService.createTask('demo-cabin', { title });
    setTasks((t) => [task, ...t]);
    setTitle('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="New task title"
          value={title}
          onChangeText={setTitle}
        />
        <Button title="Add" onPress={addTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.meta}>{item.status.toUpperCase()}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  composer: { flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
  list: { gap: 8 },
  task: { padding: 12, borderRadius: 8, backgroundColor: '#f7fbff', borderWidth: 1, borderColor: '#e5f0ff' },
  taskTitle: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666', marginTop: 6 },
});


