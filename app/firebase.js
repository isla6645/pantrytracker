// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqMiTsroePEOfCiqqdjOIOu8X9eexA2bk",
  authDomain: "inventory-management2-5f86a.firebaseapp.com",
  projectId: "inventory-management2-5f86a",
  storageBucket: "inventory-management2-5f86a.appspot.com",
  messagingSenderId: "874287998009",
  appId: "1:874287998009:web:aea246599f6960c82459e8",
  measurementId: "G-4H2LVEEV6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
