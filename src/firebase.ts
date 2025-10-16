import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore';

//https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyA1upKGvxx0vACATeUAHqNMPzbI1rebTBE",
  authDomain: "am-popcorn-store.firebaseapp.com",
  projectId: "am-popcorn-store",
  storageBucket: "am-popcorn-store.firebasestorage.app",
  messagingSenderId: "767795822825",
  appId: "1:767795822825:web:8374d6bf7b90fdbdcaf078",
  measurementId: "G-QG1MS9LTXG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); 
export const db = getFirestore(app);