// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, updateEmail, getAuth, getReactNativePersistence } from 'firebase/auth';
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } from "@env";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const storage = getStorage(app);

console.log('Firebase Storage initialized', storage);

export { firestore, auth, storage, updateEmail };