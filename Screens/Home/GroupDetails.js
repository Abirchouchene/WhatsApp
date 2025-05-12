import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from "../../Config";

const database = firebase.database();
const ref_database = database.ref();
const ref_listaccount = ref_database.child("ListAccounts");
const ref_groups = ref_database.child("groups");

export default function AddGroupMembers({ navigation, route }) {
  const currentuserid = route.params.currentuserid;
  const groupId = route.params.groupId;

  const [profiles, setProfiles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    const fetchProfiles = () => {
      ref_listaccount.on('value', (snapshot) => {
        const data = snapshot.val();
        const profilesArray = [];
        const uniqueIds = new Set();

        if (data) {
          Object.entries(data).forEach(([key, value]) => {
            const uniqueKey = `${value.pseudo}-${value.numero}`;
            if (!uniqueIds.has(uniqueKey)) {
              uniqueIds.add(uniqueKey);
              profilesArray.push({
                id: key,
                pseudo: value.pseudo,
                numero: value.numero,
                image: value.image || 'https://randomuser.me/api/portraits/lego/1.jpg',
                status: value.status || 'Hey there!',
              });
            }
          });
          setProfiles(profilesArray);
        } else {
          setProfiles([]);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching profiles:", error);
        setLoading(false);
      });
    };

    const fetchGroupMembers = () => {
      ref_groups.child(groupId).once('value', (snapshot) => {
        const groupData = snapshot.val();
        if (groupData && groupData.members) {
          setGroupMembers(groupData.members);
        } else {
          setGroupMembers([]);
        }
      });
    };

    fetchProfiles();
    fetchGroupMembers();

    return () => {
      ref_listaccount.off('value');
    };
  }, [groupId]);

  const filteredProfiles = profiles.filter(profile =>
    profile.pseudo.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelectContact = (item) => {
    setSelectedContacts(prev => {
      if (prev.includes(item.id)) {
        return prev.filter(contact => contact !== item.id); // Deselect
      } else {
        return [...prev, item.id]; // Select
      }
    });
  };

  const handleAddToGroup = () => {
    ref_groups.child(groupId).once('value', (snapshot) => {
      const groupData = snapshot.val();

      if (groupData) {
        const updatedMembers = [...groupData.members || [], ...selectedContacts];

        ref_groups.child(groupId).update({
          members: updatedMembers
        }).then(() => {
          console.log("Members added successfully.");
          navigation.goBack();
        }).catch((error) => {
          console.error("Error adding members:", error);
        });
      }
    });
  };

  if (loading) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1635776062048-025bc708a01f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      </ImageBackground>
    );
  }

  const renderContactList = () => {
    if (groupMembers.length === 0) {
      return (
        <Text style={styles.emptyText}>No contacts found in this group.</Text>
      );
    } else {
      return (
        <FlatList
          data={filteredProfiles}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.contactItem, selectedContacts.includes(item.id) ? styles.selectedItem : null]}
              onPress={() => toggleSelectContact(item)}
            >
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <View style={styles.contactInfo}>
                <Text style={styles.pseudo}>{item.pseudo}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              {selectedContacts.includes(item.id) && (
                <Ionicons name="checkmark-circle" size={24} color="#075E54" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No contacts found</Text>}
          contentContainerStyle={styles.listContent}
        />
      );
    }
  };

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

        {renderContactList()}

        <TouchableOpacity style={styles.addButton} onPress={handleAddToGroup}>
          <Text style={styles.addButtonText}>Add Selected Members</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
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
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
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
  contactInfo: {
    flex: 1,
  },
  pseudo: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  checkIcon: {
    marginLeft: 10,
  },
  addButton: {
    margin: 15,
    backgroundColor: '#075E54',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginHorizontal: 15,
    borderRadius: 10,
  },
});
