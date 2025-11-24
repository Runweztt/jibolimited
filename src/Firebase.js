
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBiA31-0TemOLfvAWAWGC--2DFSLZQ-Mcw",
  authDomain: "marketing-program-cf060.firebaseapp.com",
  projectId: "marketing-program-cf060",
  storageBucket: "marketing-program-cf060.appspot.com",
  messagingSenderId: "360799407774",
  appId: "1:360799407774:web:57be443cf0a4a7519bf58f",
  measurementId: "G-ZHKJQ66CZ7",
};

const app = initializeApp(firebaseConfig);

isSupported().then((yes) => {
  if (yes) {
    try { getAnalytics(app); } catch (e) { /* ignore analytics init errors */ }
  }
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
