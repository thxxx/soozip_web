// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import {GoogleAuthProvider} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqo2yNCw4kKO_ix2oYaJzQLnArICExcLo",
  authDomain: "soozipapp-a2a15.firebaseapp.com",
  projectId: "soozipapp-a2a15",
  storageBucket: "soozipapp-a2a15.appspot.com",
  messagingSenderId: "209476182118",
  appId: "1:209476182118:web:8e5b54ab78334871858da7",
  measurementId: "G-CEPTLWYYF0"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const firebaseInstance = firebase;
// const analytics = getAnalytics(app);
export const authService = app.auth(); // 많이 호출할거니까 아예 여기서 해버리기
export const dbService = app.firestore();
export const stService = app.storage();