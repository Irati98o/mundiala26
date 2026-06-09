const firebaseConfig = {
  apiKey: "TU_KEY",
  projectId: "TU_PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.collection("matches").get().then(snapshot => {
  console.log("🔥 datos:", snapshot.size);
});
