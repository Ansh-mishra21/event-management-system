// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQYFrTjjk9xZSjqM_L9SwqBZvLbXI_9bU",
  authDomain: "events-app-auth.firebaseapp.com",
  projectId: "events-app-auth",
  storageBucket: "events-app-auth.firebasestorage.app",
  messagingSenderId: "846148950476",
  appId: "1:846148950476:web:21e7f3b59d51fc1488e569"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export default firebase;