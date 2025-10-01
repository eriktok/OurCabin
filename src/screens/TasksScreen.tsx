import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { Task } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';

export const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const api = useCabinApi();

  useEffect(() => {
    api.getTasks('demo-cabin').then(setTasks).catch(console.error);
  }, [api]);

  const addTask = async () => {
    if (!title.trim()) return;
    const task = await api.createTask('demo-cabin', { title });
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
            <Button
              title={item.status === 'done' ? 'Mark To Do' : 'Mark Done'}
              onPress={async () => {
                const next = item.status === 'done' ? 'todo' : 'done';
                await api.updateTask(item.id, { status: next });
                setTasks((prev) => prev.map((t) => (t.id === item.id ? { ...t, status: next } : t)));
              }}
            />
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


