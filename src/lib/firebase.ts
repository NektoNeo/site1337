/**
 * Firebase Configuration
 *
 * Initializes Firebase app and exports services for use throughout the application.
 * Uses environment variables for configuration.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let firebaseApp: FirebaseApp;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    const apps = getApps();
    if (apps.length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = apps[0];
    }
  }
  return firebaseApp;
}

export { firebaseConfig };
