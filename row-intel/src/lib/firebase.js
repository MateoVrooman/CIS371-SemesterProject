// Mateo Vrooman - RowIntel - CIS371

// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6f1OeYLJ3bhFfy3izsbQgNs4vB--EwsU",
  authDomain: "rowintel-d932c.firebaseapp.com",
  projectId: "rowintel-d932c",
  storageBucket: "rowintel-d932c.firebasestorage.app",
  messagingSenderId: "582490385099",
  appId: "1:582490385099:web:8649a7a9020ed26455894e",
  measurementId: "G-BGPB1PJ70G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
