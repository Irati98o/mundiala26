import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "4e0c180e61000b9702065994866b6205",
  authDomain: "ko-mundiala.firebaseapp.com",
  projectId: "ko-mundiala",
  storageBucket: "ko-mundiala.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
