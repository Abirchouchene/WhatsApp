import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from "../../Config";
import * as ImagePicker from 'expo-image-picker';

const database = firebase.database();
const ref_database = database.ref();
const ref_listaccount = ref_database.child("ListAccounts");

export default function MyAccount(props) {
  const [pseudo, setPseudo] = useState('');
  const [numero, setNumero] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  // ✅ Récupération de currentuserid transmis depuis Home.js
  const currentuserid = props.route.params.currentuserid;

  const pickImageAsync = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const handleCreateAccount = () => {
    if (!pseudo.trim() || !numero.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (numero.length < 8) {
      setError('Phone number must be at least 8 digits');
      return;
    }

    const key = ref_listaccount.push().key;
    const ref_account = ref_listaccount.child("account" + key);

    ref_account.set({
      pseudo: pseudo.trim(),
      numero: numero.trim(),
      image: image || 'https://randomuser.me/api/portraits/lego/1.jpg',
      createdAt: new Date().toISOString(),
      status: "Hey there!",
      userId: currentuserid
    })
    .then(() => {
      setPseudo('');
      setNumero('');
      setImage(null);
      setError('');
      props.navigation.navigate('ListProfils');
    })
    .catch((error) => {
      setError('Error creating account: ' + error.message);
    });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1635776062048-025bc708a01f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ChatSphere</Text>
        </View>

        <View style={styles.container}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImageAsync}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={50} color="#999" />
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.title}>Create Your Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your Pseudo"
              placeholderTextColor="#999"
              value={pseudo}
              onChangeText={setPseudo}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              maxLength={15}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>Create Account</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={async () => {
              try {
                await firebase.auth().signOut(); // Sign out the user
                props.navigation.navigate('Auth'); // Navigate to the Auth screen
              } catch (error) {
                console.log("Error signing out: ", error.message);
              }
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#ff4444" style={styles.disconnectIcon} />
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#075E54',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#075E54',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#075E54',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#075E54',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  disconnectButton: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  disconnectText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 10,
  },
  disconnectIcon: {
    marginRight: 5,
  },
});
