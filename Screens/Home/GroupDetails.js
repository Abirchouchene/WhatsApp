import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, Image, 
  TouchableOpacity, ImageBackground, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../Config';

const database = firebase.database();
const refAccounts = database.ref('ListAccounts');
const refGroups = database.ref('groups');

export default function AddGroupMembers({ navigation, route }) {
  const { currentuserid, groupId } = route.params;

  const [profiles, setProfiles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    const unsubscribeAccounts = refAccounts.on('value', (snapshot) => {
      const data = snapshot.val();
      const unique = new Set();
      const profileList = [];

      if (data) {
        Object.entries(data).forEach(([id, info]) => {
          const key = `${info.pseudo}-${info.numero}`;
          if (!unique.has(key)) {
            unique.add(key);
            profileList.push({
              id,
              pseudo: info.pseudo,
              numero: info.numero,
              image: info.image || 'https://randomuser.me/api/portraits/lego/1.jpg',
              status: info.status || 'Hey there!',
            });
          }
        });
      }
      setProfiles(profileList);
      setLoading(false);
    });

    refGroups.child(groupId).once('value', snapshot => {
      const data = snapshot.val();
      setGroupMembers(data?.members || []);
    });

    return () => refAccounts.off('value', unsubscribeAccounts);
  }, [groupId]);

  const handleToggleSelect = (userId) => {
    setSelectedContacts(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = () => {
    refGroups.child(groupId).once('value', snapshot => {
      const data = snapshot.val();
      const currentMembers = data?.members || [];
      const updatedMembers = Array.from(new Set([...currentMembers, ...selectedContacts]));

      refGroups.child(groupId).update({ members: updatedMembers })
        .then(() => navigation.goBack())
        .catch(err => console.error("Failed to add members:", err));
    });
  };

  const filteredProfiles = profiles.filter(p =>
    p.pseudo.toLowerCase().includes(searchText.toLowerCase()) &&
    !groupMembers.includes(p.id) // exclude already in group
  );

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={[styles.contactItem, selectedContacts.includes(item.id) && styles.selectedItem]}
      onPress={() => handleToggleSelect(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.pseudo}>{item.pseudo}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      {selectedContacts.includes(item.id) && (
        <Ionicons name="checkmark-circle" size={24} color="#075E54" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1635776062048-025bc708a01f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1635776062048-025bc708a01f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Members to Group</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={filteredProfiles}
          keyExtractor={item => item.id}
          renderItem={renderContact}
          ListEmptyComponent={<Text style={styles.emptyText}>No matching contacts found.</Text>}
          contentContainerStyle={styles.listContent}
        />

        {selectedContacts.length > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddMembers}>
            <Ionicons name="person-add" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  header: {
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#075E54',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    elevation: 1,
  },
  selectedItem: {
    backgroundColor: '#d4f7e1',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactInfo: { flex: 1 },
  pseudo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#075E54',
    position: 'absolute',
    right: 20,
    bottom: 30,
    padding: 15,
    borderRadius: 30,
    elevation: 4,
  },
  listContent: { paddingBottom: 100 },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
});
