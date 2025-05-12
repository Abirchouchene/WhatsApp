import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import firebase from '../Config';

export default function Auth(props) {
  const auth = firebase.auth();

  const [email, setEmail] = useState('abir@gmail.com');
  const [password, setPassword] = useState('123456789');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (password === confirmPassword) {
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          const userID = auth.currentUser.uid; 
          alert("Connexion réussie !\nID Utilisateur : " + userID);
          props.navigation.replace('Home', { userID });
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert('Passwords do not match');
    }
  };

  const handleExit = () => {
    props.navigation.goBack();
  };

  return (
    <ImageBackground 
      source={require("../assets/back.jpg")}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>BienVenue</Text>
        
        <TextInput 
          keyboardType="email-address"
          style={styles.input} 
          placeholder="name@site.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="**pwd**"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        
        //<TextInput 
          style={styles.input} 
          placeholder="Confirm password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <View style={styles.buttonContainer}>
          <Button 
            color="black" 
            title="Submit" 
            onPress={handleSubmit}
          />
          <Button 
            color="black" 
            title="Exit" 
            onPress={handleExit}
          />
        </View>

        <Text 
          onPress={() => props.navigation.navigate("NewUser")}
          style={styles.createAccountText}
        >
          Create new account
        </Text>

        <StatusBar style="dark" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    width: '90%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  input: {
    width: '95%',
    height: 50,
    backgroundColor: 'rgba(85, 85, 85, 0.1)',
    marginBottom: 15,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  createAccountText: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
  },
});
