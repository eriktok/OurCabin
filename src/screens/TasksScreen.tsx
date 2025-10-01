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
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  composer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 16, 
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#e9ecef', 
    borderRadius: 8, 
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  list: { gap: 12 },
  task: { 
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
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  meta: { fontSize: 12, color: '#6c757d', marginTop: 8, fontWeight: '500' },
});


