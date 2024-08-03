'use client'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7PyniOMaszo3qQE7ktQ22Egh6S4dBcA0",
  authDomain: "inventory-management-app-3dd4d.firebaseapp.com",
  projectId: "inventory-management-app-3dd4d",
  storageBucket: "inventory-management-app-3dd4d.appspot.com",
  messagingSenderId: "372288522756",
  appId: "1:372288522756:web:f7d1a15f24119ceffd0351",
  measurementId: "G-VTWPW1YES3",
  appId: '1:372288522756:web:f7d1a15f24119ceffd0351',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };