// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCD0atvl3RZfUhYlD-l2m4BPHo4-F3y9bo",
  authDomain: "gym-id-login.firebaseapp.com",
  projectId: "gym-id-login",
  storageBucket: "gym-id-login.firebasestorage.app",
  messagingSenderId: "120857619975",
  appId: "1:120857619975:web:7d09058d139c0aa82b04a2",
  measurementId: "G-Q7SBBQQ02F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider};