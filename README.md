# 📱 Group Chat App

A modern group chat mobile application built with **React Native** and **Firebase** that allows users to create groups, manage members, and chat seamlessly. This app features real-time synchronization, intuitive UI/UX, and smooth group member handling functionality.

---

## ✨ Features

- 🔐 Firebase Authentication
- 👥 Create and manage group chats
- ➕ Add and remove group members
- 📡 Real-time database integration
- 🖼️ Profile images and statuses
- 🔍 Search and filter contacts
- 🌐 Beautiful background imagery and clean design

---

## 🛠️ Tech Stack

| Tech | Description |
|------|-------------|
| [React Native](https://reactnative.dev/) | Cross-platform mobile app framework |
| [Firebase Realtime Database](https://firebase.google.com/docs/database) | Cloud-hosted NoSQL database |
| [Firebase Auth](https://firebase.google.com/products/auth) | Secure authentication |
| [Expo](https://expo.dev/) | React Native tooling & development platform |

---

## 📷 Screenshots

<p float="left">
  <img src="https://i.imgur.com/abc123.png" width="250" />
  <img src="https://i.imgur.com/def456.png" width="250" />
  <img src="https://i.imgur.com/ghi789.png" width="250" />
</p>

*(Replace the URLs above with your actual screenshots or GIF previews)*

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Firebase Project (create one at [console.firebase.google.com](https://console.firebase.google.com))

### Installation

```bash
git clone https://github.com/Abir-Chochene/group-chat-app.git
cd group-chat-app
npm install
expo start
```

### Firebase Configuration

Create a `Config.js` file in the root folder:

```javascript
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
```

> 💡 Make sure your Firebase Realtime Database rules allow authenticated read/write access (for development only).

---

## 🧠 Architecture Overview

- **Screens**: Components like `AddGroupMembers`, `GroupChat`, etc.
- **Firebase**: Used for data persistence and user account management.
- **Navigation**: Managed using `@react-navigation/native`.

---

## 👨‍💻 Contributors

- 🧑‍💼 **Project Owner:** [Abir Chochene](https://github.com/Abir-Chochene)
- 🤝 **Collaborator:** [Louay Amor](https://github.com/LouayAmor)

---

## 📃 License

This project is open source and available under the [MIT License](LICENSE).

---

## ❤️ Support

If you like this project, consider starring ⭐ it on GitHub and sharing it with others!
