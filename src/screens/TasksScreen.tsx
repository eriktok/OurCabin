import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Task } from '../core/models';
import { useCabinApi } from '../services/ServiceProvider';
import { Card } from '../components/ui/Card';
import { AppHeader } from '../components/ui/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafeIcon } from '../components/ui/SafeIcon';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

type TaskFilter = 'all' | 'todo' | 'done' | 'overdue';
type TaskPriority = 'low' | 'medium' | 'high';

export const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium' as TaskPriority,
    dueDate: null as Date | null,
  });
  const api = useCabinApi();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const allTasks = await api.getTasks('demo-cabin');
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const task = await api.createTask('demo-cabin', { 
        title: newTask.title,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
      });
      setTasks(prev => [task, ...prev]);
      setNewTask({ title: '', priority: 'medium', dueDate: null });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
      await api.updateTask(taskId, { status: nextStatus });
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: nextStatus } : t
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const today = startOfDay(new Date());
    const taskDueDate = task.dueDate ? startOfDay(new Date(task.dueDate)) : null;
    
    switch (filter) {
      case 'todo':
        return task.status === 'todo';
      case 'done':
        return task.status === 'done';
      case 'overdue':
        return task.status === 'todo' && taskDueDate && isBefore(taskDueDate, today);
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#D32F2F';
      case 'medium': return '#ED6C02';
      case 'low': return '#2E7D32';
      default: return '#666';
    }
  };

  const getPrioritySafeIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'minus-circle';
      case 'low': return 'check-circle';
      default: return 'circle-outline';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Tasks" 
        right={
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <SafeIcon name="plus" size={24} color="#2E7D32" />
          </TouchableOpacity>
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {(['all', 'todo', 'done', 'overdue'] as TaskFilter[]).map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[styles.filterButton, filter === filterOption && styles.filterButtonActive]}
            onPress={() => setFilter(filterOption)}
          >
            <Text style={[styles.filterText, filter === filterOption && styles.filterTextActive]}>
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.taskHeader}>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, item.status === 'done' && styles.taskTitleCompleted]}>
                  {item.title}
                </Text>
                <View style={styles.taskMeta}>
                  <View style={styles.priorityContainer}>
                    <SafeIcon 
                      name={getPrioritySafeIcon(item.priority || 'medium')} 
                      size={16} 
                      color={getPriorityColor(item.priority || 'medium')} 
                    />
                    <Text style={[styles.priorityText, { color: getPriorityColor(item.priority || 'medium') }]}>
                      {item.priority || 'medium'}
                    </Text>
                  </View>
                  {item.dueDate && (
                    <Text style={styles.dueDate}>
                      Due: {format(new Date(item.dueDate), 'MMM dd')}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={[styles.statusButton, item.status === 'done' && styles.statusButtonCompleted]}
                onPress={() => toggleTaskStatus(item.id, item.status)}
              >
                <SafeIcon 
                  name={item.status === 'done' ? 'check' : 'circle-outline'} 
                  size={24} 
                  color={item.status === 'done' ? '#2E7D32' : '#666'} 
                />
              </TouchableOpacity>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <SafeIcon name="check-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'all' ? 'Add your first task!' : `No ${filter} tasks`}
            </Text>
          </View>
        }
      />

      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Task</Text>
            <PrimaryButton
              title="Add"
              onPress={addTask}
              style={styles.addButton}
            />
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.titleInput}
              placeholder="Task title"
              value={newTask.title}
              onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
            />

            <View style={styles.prioritySection}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.priorityOptions}>
                {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      newTask.priority === priority && styles.priorityOptionSelected
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, priority }))}
                  >
                    <SafeIcon 
                      name={getPrioritySafeIcon(priority)} 
                      size={20} 
                      color={newTask.priority === priority ? '#fff' : getPriorityColor(priority)} 
                    />
                    <Text style={[
                      styles.priorityOptionText,
                      newTask.priority === priority && styles.priorityOptionTextSelected
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: { 
    paddingBottom: 16 
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1A1F2C',
    marginBottom: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  statusButtonCompleted: {
    backgroundColor: '#E8F5E9',
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
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  prioritySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1F2C',
    marginBottom: 12,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  priorityOptionSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  priorityOptionTextSelected: {
    color: '#fff',
  },
});


