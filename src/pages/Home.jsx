import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import MatchCard from "../components/MatchCard";
import Leaderboard from "../components/Leaderboard";

export default function Home({ user }) {

  const [tab, setTab] = useState("matches"); // ✅ nueva pestaña

  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);

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


  return (
    <div>

      {/* 🔘 BOTONES DE PESTAÑAS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setTab("matches")}
          style={{ fontWeight: tab === "matches" ? "bold" : "normal" }}
        >
          Partidos
        </button>

        <button
          onClick={() => setTab("leaderboard")}
          style={{ fontWeight: tab === "leaderboard" ? "bold" : "normal" }}
        >
          Clasificación
        </button>
      </div>

      {/* 📄 CONTENIDO SEGÚN PESTAÑA */}
      {tab === "matches" && (
        <div>
          {sortedMatches.map(m => (
            <MatchCard
              key={m.id}
              match={m}
              onPredict={predict}
              getUserPrediction={getUserPrediction}
            />
          ))}
        </div>
      )}

      {tab === "leaderboard" && (
        <Leaderboard />
      )}

    </div>
  );
}
