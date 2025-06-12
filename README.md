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

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Firebase Project (create one at [console.firebase.google.com](https://console.firebase.google.com))

### Installation

```bash
git clone [https://github.com/Abirchouchene/WhatsApp]
cd whatsapp
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

- **Screens**
- **Firebase**
- **Navigation**

---

## 👨‍💻 Contributors

- 🧑‍💼 **Project Owner:** [Abir Chochene](https://github.com/Abir-Chouchene)
- 🤝 **Collaborator:** [Louay Amor](https://github.com/LouayAmor)

---

## 📃 License

This project is open source and available under the [MIT License](LICENSE).

---

## ❤️ Support

If you like this project, consider starring ⭐ it on GitHub and sharing it with others!
