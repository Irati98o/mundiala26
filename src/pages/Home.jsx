import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import MatchCard from "../components/MatchCard";
import Leaderboard from "../components/Leaderboard";
import GroupTable from "../components/GroupTable";
import KOPhase from "./KOPhase";

export default function Home({ user }) {

  const [tab, setTab] = useState("matches"); // ✅ nueva pestaña

  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [equiposVivos, setEquiposVivos] = useState([]);
  const puntosPorRonda = {
    R32: 1,
    R16: 1,
    QF: 2,
    SF: 3,
    FOURTH: 4,
    THIRD: 8,
    SECOND: 12,
    FIRST: 16
  }; 
  const [rondas, setRondas] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "matches"), snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "predictions"), snap => {
      setPredictions(snap.docs.map(d => d.data()));
    });
    return unsub;
  }, []);

  const predict = async (matchId, prediction) => {
    const predictionId = `${user.id}_${matchId}`;
    await setDoc(doc(db, "predictions", predictionId), {
      userId: user.id,
      matchId,
      prediction,
      points: 0
    });
  };

  const getUserPrediction = (matchId) => {
    return predictions.find(
      p => p.userId === user.id && p.matchId === matchId
    );
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (!a.date || !b.date) return 0;

    return a.date.toDate() - b.date.toDate();
  });
  
  const jugadores = userTeams.map(user => {
    const equipos = user.teams || [];
  
    const puntosEquipos = calcularPuntosEquipos(equipos);
  
    return {
      nombre: user.id.replace("_teams", ""),
      equipos,
      puntosEquipos
    };
  });

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "tournamentResults", "R32"),
      (docSnap) => {
        if (docSnap.exists()) {
          setEquiposVivos(docSnap.data().teams || []);
        }
      }
    );
    
    return unsub;
  }, []);

  useEffect(() => {
    const fases = ["R32", "R16", "QF", "SF", "FOURTH", "THIRD", "SECOND", "FIRST"];
  
    const unsubs = fases.map(fase =>
      onSnapshot(doc(db, "tournamentResults", fase), snap => {
        if (snap.exists()) {
          setRondas(prev => ({
            ...prev,
            [fase]: snap.data().teams || []
          }));
        }
      })
    );
  
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const calcularPuntosEquipos = (equiposJugador) => {
    let total = 0;
  
    Object.entries(puntosPorRonda).forEach(([fase, puntos]) => {
      const equiposEnRonda = rondas[fase] || [];
  
      const aciertos = equiposJugador.filter(e =>
        equiposEnRonda.includes(e)
      ).length;
  
      total += aciertos * puntos;
    });
  
    return total;
  };

  return (
    <div>

      {/* 🔘 BOTONES DE PESTAÑAS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {/* <button
          onClick={() => setTab("matches")}
          style={{ fontWeight: tab === "matches" ? "bold" : "normal" }}
        >
          Apostuek
        </button> */}

        <button
          onClick={() => setTab("leaderboard")}
          style={{ fontWeight: tab === "leaderboard" ? "bold" : "normal" }}
        >
          Rankinge
        </button>

        {/* <button onClick={() => setTab("groups")}
          style={{ fontWeight: tab === "leaderboard" ? "bold" : "normal" }}>
          Sailkapena
        </button> */}

        <button
          onClick={() => setTab("ko")}
          style={{ fontWeight: tab === "ko" ? "bold" : "normal" }}
        >
          Eliminatoriak
        </button>

      </div>

      {/* 📄 CONTENIDO SEGÚN PESTAÑA */}
      {tab === "teams" && (
        <UserTeams jugadores={jugadores} equiposVivos = {equiposVivos} />
      )}

      {tab === "leaderboard" && (
        <Leaderboard />
      )}

      {tab === "groups" && (
        <GroupTable />
      )}

      {tab == "ko" && (
        <KOPhase user={user} />
      )}

    </div>
  );
}
