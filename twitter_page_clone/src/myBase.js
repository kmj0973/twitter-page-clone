// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt60rCQj5yZpGge06JouM7vMIWBm6_PHo",
  authDomain: "twitter-page-clone.firebaseapp.com",
  projectId: "twitter-page-clone",
  storageBucket: "twitter-page-clone.appspot.com",
  messagingSenderId: "383332464531",
  appId: "1:383332464531:web:d8292b1af06b5984651a66",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authService = getAuth();
