import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBQhzh1FYYO0OfxYMaaNA9_xynp5O8zRM4",
  authDomain: "bharatone-assignment.firebaseapp.com",
  projectId: "bharatone-assignment",
  storageBucket: "bharatone-assignment.appspot.com",
  messagingSenderId: "445690345207",
  appId: "1:445690345207:web:615257f4fd8bd8444e85f2",
  databaseURL:
    "https://bharatone-assignment-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

firebase.initializeApp(firebaseConfig);
export const dataRef = firebase.database();

export default firebase;
