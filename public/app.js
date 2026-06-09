const firebaseConfig = {
  apiKey: "ko-mundiala",
  projectId: "2026ko mundiala",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function loadMatches(){

  db.collection("matches").onSnapshot(snapshot=>{

    let html="";

    snapshot.forEach(doc=>{
      const m = doc.data();

      html += `<div>
        ${m.home} vs ${m.away}
      </div>`;
    });

    document.getElementById("matches").innerHTML = html;
  });
}

loadMatches();