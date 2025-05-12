import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp from '../Config'; // Assurez-vous que Firebase est bien initialisé dans ce fichier

const auth = getAuth(firebaseApp);

export default function NewUser(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');

  const handleCreateAccount = () => {
    if (password === confirmpassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          const userID = auth.currentUser.uid; //  Récupération de l'UID
          alert("Compte créé avec succès !\nID Utilisateur : " + userID);
          props.navigation.replace('Home', { userID }); // On passe l'ID à l'écran Home
        })
        .catch((error) => {
          alert("Erreur: " + error.message);
        });
    } else {
      alert("Les mots de passe ne correspondent pas !");
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/back.jpg")}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput 
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          style={styles.input} 
          placeholder="name@site.com"
          autoCapitalize="none" 
        />
        
        <TextInput 
          onChangeText={setPassword}
          value={password}
          style={styles.input} 
          placeholder="***Password***" 
          secureTextEntry={true} 
        />
        
        <TextInput 
          onChangeText={setConfirmpassword} 
          value={confirmpassword}
          style={styles.input} 
          placeholder="***Confirm Password***" 
          secureTextEntry={true} 
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            color="black" 
            title="Create" 
            onPress={handleCreateAccount}
          />

          <Button 
            color="black" 
            title="Back" 
            onPress={() => props.navigation.goBack()} 
          />
        </View>

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
    width: "90%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "bold",
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
  input: {
    width: "95%",
    height: 50,
    backgroundColor: "rgba(85, 85, 85, 0.1)",
    marginBottom: 15,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 4,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  }
});
