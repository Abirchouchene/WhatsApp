// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdZB6OyIgfwvwPVA9WDt5NLq5asD7GLs0",
  authDomain: "systemmanagement-e9deb.firebaseapp.com",
  databaseURL: "https://systemmanagement-e9deb-default-rtdb.firebaseio.com",
  projectId: "systemmanagement-e9deb",
  storageBucket: "systemmanagement-e9deb.firebasestorage.app",
  messagingSenderId: "947687284971",
  appId: "1:399865130208:android:ba5be80e56fd336686b485",
  measurementId: "G-3HMGVPQ4HQ"
};


// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);


export default firebase;
