// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCDWHK75ZRhcQp5yAnqOlqcPWBCm9NypNY",
  authDomain: "pulchowk-date.firebaseapp.com",
  projectId: "pulchowk-date",
  storageBucket: "pulchowk-date.firebasestorage.app",
  messagingSenderId: "1066167780371",
  appId: "1:1066167780371:web:70433167b34da3ab45ebe6",
  measurementId: "G-3DRZ4F29FW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);