import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import firebase from "../Config/index";
import { Ionicons } from "@expo/vector-icons"; // pour l'icône d'appel

const database = firebase.database();

const Chat = (props) => {
  const currentid = props.route.params.currentid;
  const secondid = props.route.params.secondid;

  const discid = currentid > secondid ? currentid + secondid : secondid + currentid;
  const ref_discussion = database.ref("List_discussions").child(discid);
  const ref_messages = ref_discussion.child("messages");
  const ref_typing_me = ref_discussion.child(currentid + "_istyping");
  const ref_typing_other = ref_discussion.child(secondid + "_istyping");

  const [istyping, setIsTyping] = useState(false);
  const [Messages, setMessages] = useState([]);
  const [msg, setmsg] = useState("");

  // Écoute de l'état "is typing" de l'autre utilisateur
  useEffect(() => {
    ref_typing_other.on("value", (snapshot) => {
      setIsTyping(snapshot.val() === true);
    });
    return () => {
      ref_typing_other.off();
    };
  }, []);

  // Écoute des messages
  useEffect(() => {
    ref_messages.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((snap) => {
        d.push(snap.val());
      });
      setMessages(d);
    });
    return () => {
      ref_messages.off();
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const key = ref_messages.push().key;
    ref_messages.child(key).set({
      body: msg,
      time: new Date().toLocaleString(),
      sender: currentid,
      receiver: secondid,
    });

    setmsg("");
    ref_typing_me.set(false);
  };

  return (
    <ImageBackground source={require("../assets/loginback.jpg")} style={styles.container}>
      {/* En-tête de la discussion */}
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <TouchableOpacity onPress={() => alert("Appel en cours...")}>
          <Ionicons name="call-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={Messages}
        style={styles.messageList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          const isMine = item.sender === currentid;
          return (
            <View
              style={[
                styles.messageContainer,
                {
                  backgroundColor: isMine ? "rgba(57, 91, 228, 0.98)" : "white",
                  alignSelf: isMine ? "flex-end" : "flex-start",
                },
              ]}
            >
              <Text style={{ color: isMine ? "white" : "black" }}>{item.body}</Text>
              <Text style={[styles.time, { color: isMine ? "white" : "black" }]}>{item.time}</Text>
            </View>
          );
        }}
      />

      {/* Affichage de "is typing" */}
      {istyping && <Text style={styles.typingText}>L'autre utilisateur écrit...</Text>}

      {/* Champ de saisie et bouton d'envoi */}
      <View style={styles.inputContainer}>
        <TextInput
          value={msg}
          onChangeText={(text) => {
            setmsg(text);
            ref_typing_me.set(true);
          }}
          placeholder="Message..."
          style={styles.textInput}
          onBlur={() => ref_typing_me.set(false)}
        />
        <Button title="Envoyer" onPress={sendMessage} />
      </View>
    </ImageBackground>
  );
};

export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffffaa",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  time: {
    fontSize: 10,
    marginTop: 4,
  },
  typingText: {
    fontStyle: "italic",
    color: "#fff",
    marginLeft: 15,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    flex: 1,
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
