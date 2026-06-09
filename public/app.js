const firebaseConfig = {
  apiKey: "ko-mundiala",
  projectId: "2026ko mundiala"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.collection("matches").get().then(snapshot => {
  console.log("🔥 datos:", snapshot.size);
});
