const firebaseConfig = {
  apiKey: "ko-mundiala",
  projectId: "2026ko mundiala"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function loadMatches(){

  db.collection("matches").onSnapshot(snapshot => {

  console.log("🔥 docs raw:", snapshot.docs);

  let html = "";

  snapshot.forEach(doc => {
    console.log("👉 doc:", doc.data());

    const m = doc.data();

    html += `
      <div style="color:white;">
        ${m.home} vs ${m.away}
      </div>
    `;
  });

  document.getElementById("matches").innerHTML = html;
});
}

loadMatches();
