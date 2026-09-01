// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdv1lsI3R4C4mwFNDxIt_C2lTvQLNcE5c",
  authDomain: "el-store-5070e.firebaseapp.com",
  projectId: "el-store-5070e",
  storageBucket: "el-store-5070e.firebasestorage.app",
  messagingSenderId: "683292660908",
  appId: "1:683292660908:web:0bd077859ddc3a8ead3b09",
  measurementId: "G-5KHR5LHYCS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);