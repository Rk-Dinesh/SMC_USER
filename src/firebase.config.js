// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwZKo09zss5D0s2RnNj5aY5xvWsVBGemI",
  authDomain: "pick-my-course-da02e.firebaseapp.com",
  databaseURL: "https://pick-my-course-da02e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pick-my-course-da02e",
  storageBucket: "pick-my-course-da02e.firebasestorage.app",
  messagingSenderId: "27261355513",
  appId: "1:27261355513:web:aed4e8672495a506a92928"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);