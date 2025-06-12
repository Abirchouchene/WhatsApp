import React, { useState, useEffect, useCallback } from 'react';
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

const PRIMARY_COLOR = '#075E54';
const ACCENT_COLOR = '#25D366';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150';

export default function Groups() {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');

  // Fetch groups from Firebase
  useEffect(() => {
    const db = getDatabase();
    const groupsRef = ref(db, 'groups/');
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groupList = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setGroups(groupList);
      } else {
        setGroups([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupPress = (groupId) => {
    navigation.navigate('GroupDetails', { groupId });
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Erreur', 'Le nom du groupe est requis.');
      return;
    }

    const db = getDatabase();
    const groupsRef = ref(db, 'groups/');
    const newGroup = {
      name: groupName.trim(),
      image: groupImage.trim() || PLACEHOLDER_IMAGE,
    };

    push(groupsRef, newGroup)
      .then(() => {
        Alert.alert('Succès', 'Le groupe a été créé avec succès.');
        setGroupName('');
        setGroupImage('');
        setIsModalVisible(false);
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

  const renderGroupItem = useCallback(({ item }) => (
    <View style={styles.groupItem}>
      <TouchableOpacity style={styles.groupInfo} onPress={() => handleGroupPress(item.id)}>
        <Image source={{ uri: item.image }} style={styles.groupImage} />
        <Text style={styles.groupName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteGroup(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  ), [handleDeleteGroup]);

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        placeholder="Rechercher un groupe"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      {/* Create Button */}
      <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.createButton}>
        <Text style={styles.createButtonText}>+ Créer un Groupe</Text>
      </TouchableOpacity>

      {/* Group List */}
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />

      {/* Modal for Create Group */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
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
              <TouchableOpacity onPress={handleCreateGroup} style={styles.confirmButton}>
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
    backgroundColor: '#f7f7f7',
    padding: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 45,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  createButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
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
    marginRight: 12,
    backgroundColor: '#eee',
  },
  groupName: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: '45%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    marginRight: 20,
    paddingVertical: 6,
  },
  confirmButton: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
