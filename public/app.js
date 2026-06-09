// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "ko-mundiala",
  projectId: "2026ko mundiala",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 👤 usuario sin login
let user = localStorage.getItem("user");

// LOGIN SIMPLE
if(!user){
  document.getElementById("login").innerHTML = `
    <input id="name" placeholder="Irati">
    <button onclick="saveName()">Entrar</button>
  `;
} else {
  startApp();
}

async function saveName(){
  const name = document.getElementById("name").value.trim();

  const exists = await db.collection("users").doc(name).get();

  if(exists.exists){
    alert("Nombre ya usado");
    return;
  }

  await db.collection("users").doc(name).set({
    name,
    totalPoints: 0,
    isAdmin: name === "Irati"
  });

  localStorage.setItem("user", name);
  location.reload();
}

function startApp(){
  document.getElementById("login").style.display="none";
  document.getElementById("app").style.display="block";
  document.getElementById("username").innerText = user;

  loadMatches();
  loadRanking();
  loadChart();
  checkAdmin();
}

// ✅ PARTIDOS + BLOQUEO
async function loadMatches(){
  const matches = await fetch("/api/matches").then(r=>r.json());
  const div = document.getElementById("matches");

  div.innerHTML="";

  matches.slice(0,20).forEach(m=>{
    const started = new Date(m.fixture.date) <= new Date();

    div.innerHTML += `
      <div class="match ${started?'locked':''}">
        ${m.teams.home.name} ${m.goals.home ?? "-"} - ${m.goals.away ?? "-"} ${m.teams.away.name}
        <br>
        ${started ? '🔒' : `
          <button onclick="bet('${m.fixture.id}','1')">1</button>
          <button onclick="bet('${m.fixture.id}','X')">X</button>
          <button onclick="bet('${m.fixture.id}','2')">2</button>
        `}
      </div>
    `;
  });
}

async function bet(id,value){
  const matches = await fetch("/api/matches").then(r=>r.json());
  const m = matches.find(x=>x.fixture.id==id);

  if(new Date(m.fixture.date)<=new Date()){
    alert("Partido empezado");
    return;
  }

  await db.collection("bets").doc(user).set({
    [id]: value
  }, {merge:true});
}

// 🏆 RANKING
function loadRanking(){
  db.collection("users").onSnapshot(snapshot=>{
    let list=[];

    snapshot.forEach(doc=>list.push(doc.data()));

    list.sort((a,b)=>b.totalPoints-a.totalPoints);

    document.getElementById("ranking").innerHTML =
      list.map((p,i)=>`
        <div class="${i==0?'top1':''}">
          ${i+1}. ${p.name} - ${p.totalPoints}
        </div>
      `).join("");
  });
}

// 📊 GRÁFICO FIFA STYLE
async function loadChart(){
  const snapshot = await db.collection("points_history").get();

  let labels=[];
  let data=[];

  snapshot.forEach(doc=>{
    labels.push(doc.id);
    data.push(doc.data()[user] || 0);
  });

  new Chart(document.getElementById("chart"), {
    type:"line",
    data:{
      labels,
      datasets:[{
        label:"Puntos",
        data,
        borderColor:"gold"
      }]
    }
  });
}

// 🛡️ ADMIN
async function checkAdmin(){
  const doc = await db.collection("users").doc(user).get();
  if(doc.data().isAdmin){
    document.getElementById("adminPanel").style.display="block";
  }
}

// 🔔 PUSH
navigator.serviceWorker.register("sw.js");

setInterval(loadMatches,300000);
