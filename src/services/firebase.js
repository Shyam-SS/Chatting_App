import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeR3-_H4YifHi6k8HmmDXN3o1fMC2BpyI",
  authDomain: "chat-app-ba42c.firebaseapp.com",
  projectId: "chat-app-ba42c",
  storageBucket: "chat-app-ba42c.firebasestorage.app",
  messagingSenderId: "97332088886",
  appId: "1:97332088886:web:558532cd54e41705df8897"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
