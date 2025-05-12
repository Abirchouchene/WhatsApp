import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

export default function Groups() {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & form states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const groupsRef = ref(db, 'groups/');
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      const groupList = [];
      for (let id in data) {
        groupList.push({ id, ...data[id] });
      }
      setGroups(groupList);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (text) => setSearchQuery(text);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupPress = (groupId) => {
    navigation.navigate('GroupDetails', { groupId }); // Navigate to GroupDetails
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Erreur', 'Le nom du groupe est requis.');
      return;
    }

    const newGroup = {
      name: groupName.trim(),
      image: groupImage.trim() || 'https://via.placeholder.com/150',
    };

    const db = getDatabase();
    const groupsRef = ref(db, 'groups/');
    push(groupsRef, newGroup)
      .then(() => {
        Alert.alert('Succès', 'Le groupe a été créé avec succès.');
        setIsModalVisible(false);
        setGroupName('');
        setGroupImage('');
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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rechercher un groupe"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.createButton}
      >
        <Text style={styles.createButtonText}>Créer un Groupe</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <TouchableOpacity
              style={styles.groupInfo}
              onPress={() => handleGroupPress(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.groupImage} />
              <Text>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteGroup(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal for group creation */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Créer un Groupe</Text>
            <TextInput
              placeholder="Nom du groupe"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
            />
            <TextInput
              placeholder="URL de l'image (facultatif)"
              value={groupImage}
              onChangeText={setGroupImage}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateGroup}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#34b7f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  createButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteText: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    color: '#34b7f1',
  },
  confirmButton: {
    backgroundColor: '#34b7f1',
    padding: 10,
    borderRadius: 5,
  },
  confirmText: {
    color: 'white',
  },
});
