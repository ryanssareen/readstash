import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNBKntt3yCmPqXkELFCFXGwGfr3pprKBs",
  authDomain: "readstash-43bc7.firebaseapp.com",
  projectId: "readstash-43bc7",
  storageBucket: "readstash-43bc7.firebasestorage.app",
  messagingSenderId: "494898509812",
  appId: "1:494898509812:web:5d0a64aad7117128d2aba1",
};

export const isFirebaseConfigured = true;

function getApp(): FirebaseApp {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

let _auth: Auth | null = null;
let _db: Firestore | null = null;

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}

export function getFirebaseDb(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}
