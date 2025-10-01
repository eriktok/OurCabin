import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList } from 'react-native';
import { useCabinApi } from '../services/ServiceProvider';
import { Cabin } from '../core/models';

interface Props {
  userId: string;
  onCabinSelected: (cabin: Cabin) => void;
}

export const CabinGateScreen: React.FC<Props> = ({ userId, onCabinSelected }) => {
  const api = useCabinApi();
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [name, setName] = useState('');
  const [invite, setInvite] = useState('');

  useEffect(() => {
    api.listCabinsForUser(userId).then(setCabins).catch(console.error);
  }, [api, userId]);

  const create = async () => {
    if (!name.trim()) return;
    const cabin = await api.createCabin(name.trim());
    onCabinSelected(cabin);
  };

  const join = async () => {
    if (!invite.trim()) return;
    const cabin = await api.joinCabin(invite.trim());
    onCabinSelected(cabin);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your cabin</Text>
      <FlatList
        data={cabins}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <View style={styles.cabin}>
            <Text style={styles.cabinName}>{item.name}</Text>
            <Button title="Select" onPress={() => onCabinSelected(item)} />
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create a new cabin</Text>
        <TextInput style={styles.input} placeholder="Cabin name" value={name} onChangeText={setName} />
        <Button title="Create" onPress={create} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join with invite code</Text>
        <TextInput style={styles.input} placeholder="Invite code" value={invite} onChangeText={setInvite} />
        <Button title="Join" onPress={join} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  list: { gap: 8, marginBottom: 16 },
  cabin: { padding: 12, borderRadius: 8, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cabinName: { fontSize: 16 },
  section: { marginTop: 12, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
});


