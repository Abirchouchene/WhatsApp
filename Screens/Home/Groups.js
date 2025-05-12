import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

export default function Groups() {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const groupsRef = ref(db, 'groups/');
    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      const groupList = [];
      for (let id in data) {
        groupList.push({ id, ...data[id] });
      }
      setGroups(groupList);
    });
  }, []);

  const handleCreateGroup = () => {
    const newGroup = {
      name: 'New Group',
      image: 'https://via.placeholder.com/150',
    };
    const db = getDatabase();
    const groupsRef = ref(db, 'groups/');
    push(groupsRef, newGroup)
      .then(() => {
        Alert.alert('Succès', 'Le groupe a été créé avec succès.');
      })
      .catch(() => {
        Alert.alert('Erreur', 'Impossible de créer le groupe.');
      });
  };

  const handleDeleteGroup = (groupId) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous supprimer ce groupe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const db = getDatabase();
            const groupRef = ref(db, `groups/${groupId}`);
            remove(groupRef)
              .then(() => Alert.alert('Supprimé', 'Le groupe a été supprimé.'))
              .catch(() => Alert.alert('Erreur', 'Suppression échouée.'));
          },
        },
      ]
    );
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupPress = (groupId) => {
    navigation.navigate('Chat', { groupId });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Rechercher un groupe"
        value={searchQuery}
        onChangeText={handleSearch}
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 10,
          paddingLeft: 10,
          marginBottom: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleCreateGroup}
        style={{
          backgroundColor: '#34b7f1',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Créer un Groupe
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
              justifyContent: 'space-between',
            }}
          >
            {/* Partie cliquable pour ouvrir le chat */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              onPress={() => handleGroupPress(item.id)}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 10,
                }}
              />
              <Text>{item.name}</Text>
            </TouchableOpacity>

            {/* Bouton Supprimer */}
            <TouchableOpacity
              onPress={() => handleDeleteGroup(item.id)}
              style={{
                backgroundColor: '#ff4d4d',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                marginLeft: 10,
              }}
            >
              <Text style={{ color: 'white' }}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
