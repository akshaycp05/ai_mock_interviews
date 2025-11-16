import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbnNk5dm_mXR66e2WUctcpSSxpGBZOIJk",
  authDomain: "alvas-69a4c.firebaseapp.com",
  projectId: "alvas-69a4c",
  storageBucket: "alvas-69a4c.firebasestorage.app",
  messagingSenderId: "1021277601560",
  appId: "1:1021277601560:web:6f42f25dbd6a1f08aa686d",
  measurementId: "G-DWDXNFR4C5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
