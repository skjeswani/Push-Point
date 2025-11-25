import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithRedirect,
    signOut as firebaseSignOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZkXhTXCKzpFX3FbxpzGh26KpzkeVQOVU",
  authDomain: "pushpoint-6aa25.firebaseapp.com",
  projectId: "pushpoint-6aa25",
  storageBucket: "pushpoint-6aa25.firebasestorage.app",
  messagingSenderId: "669334293470",
  appId: "1:669334293470:web:75feaefea2bfeb8918ab4f",
  measurementId: "G-YBNL0CCH4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Export auth and db for use in other files
export { auth, db };

// Wrappers for auth functions
export const onAuthChange = (callback: (user: import("firebase/auth").User | null) => void) => {
    return onAuthStateChanged(auth, callback);
}

export const signInWithGoogle = () => {
    return signInWithRedirect(auth, googleProvider);
}

export const signInWithGithub = () => {
    return signInWithRedirect(auth, githubProvider);
}

export const signOut = () => {
    return firebaseSignOut(auth);
}