import React, { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import firebase from "../Config";

const database = firebase.database();
const ref_listDiscussions = database.ref().child("List_discussions");

const Chat = ({ route, navigation }) => {
  const { currentid, secondid, pseudo, image } = route.params;
  const discid = [currentid, secondid].sort().join('_');
  
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref_listDiscussions.child(discid).child("messages");
    const listener = messagesRef.on("value", (snapshot) => {
      const messageData = snapshot.val();
      if (messageData) {
        const messageList = Object.entries(messageData)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => a.time - b.time); // Sort by timestamp ascending
        setMessages(messageList);
        // Scroll to bottom when new messages load
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

    return () => messagesRef.off("value", listener);
  }, [discid]);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const ref_disc = ref_listDiscussions.child(discid);
    const ref_messages = ref_disc.child("messages");
    const newMessage = {
      body: msg,
      time: Date.now(),
      sender: currentid,
      receiver: secondid,
    };

    ref_messages.push(newMessage)
      .then(() => {
        setMsg("");
        // Scroll to bottom after sending
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === currentid;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUser : styles.otherUser,
          isCurrentUser ? { borderBottomRightRadius: 0 } : { borderBottomLeftRadius: 0 },
        ]}
      >
        <Text style={styles.messageText}>{item.body}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.time).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: image }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerText}>{pseudo}</Text>
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        // Remove inverted prop
        initialNumToRender={20}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder="Type a message"
            placeholderTextColor="#999"
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color="#999" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#075E54",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 12,
    color: "#E0E0E0",
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "75%",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  currentUser: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  otherUser: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  messageTime: {
    fontSize: 11,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  footer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#F2F0E9",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    paddingHorizontal: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 5,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00A884",
    justifyContent: "center",
    alignItems: "center",
  },
});