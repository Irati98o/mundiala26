import React from "react";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import MatchCard from "../components/MatchCard";

export default function Home({ user }) {

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "matches"), snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "predictions"),
      snap => {
        setPredictions(snap.docs.map(d => d.data()));
      }
    );
    return unsub;
  }, []);

  const predict = async (matchId, prediction) => {
    await addDoc(collection(db, "predictions"), {
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

  return (
    <div>
      {matches.map(m => (
        <MatchCard key={m.id} match={m} onPredict={predict} getUserPrediction={getUserPrediction}/>
      ))}
    </div>
  );
}
