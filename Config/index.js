// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtiyTeEd3xwEM2vefFCClkEM16lcVNclo",
  authDomain: "whatsapp-84e47.firebaseapp.com",
  databaseURL: "https://whatsapp-84e47-default-rtdb.firebaseio.com",
  projectId: "whatsapp-84e47",
  storageBucket: "whatsapp-84e47.firebasestorage.app",
  messagingSenderId: "947687284971",
  appId: "1:947687284971:web:74029a6916772f2f0adeae",
  measurementId: "G-3HMGVPQ4HQ"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);

export default firebase;
