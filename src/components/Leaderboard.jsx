import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export default function Leaderboard() {
  const [predictions, setPredictions] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "predictions"), snap => {
      setPredictions(snap.docs.map(d => d.data()));
    });

    const unsub2 = onSnapshot(collection(db, "matches"), snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // ✅ calcular puntos por usuario
  const leaderboard = {};

  predictions.forEach(p => {
    const match = matches.find(m => m.id === p.matchId);

    if (!match) return;

    //✅ ignorar partidos no jugados
    if (match.status !== "FT") return;

    const realResult = getResult(match);
    const isCorrect = p.prediction === realResult;

    const points = isCorrect ? 2 : 0;

    if (!leaderboard[p.userId]) {
      leaderboard[p.userId] = 0;
    }

    leaderboard[p.userId] += points;
  });

  // convertir a array y ordenar
  const ranking = Object.entries(leaderboard)
    .map(([userId, points]) => ({ userId, points }))
    .sort((a, b) => b.points - a.points);

  const getResult = (match) => {
    if (!match.score) return null;
    const home = match.score.home;
    const away = match.score.away;

    if (home > away) return "1";
    if (home < away) return "2";
    return "X";
  };
  
  return (
    <div>
      <h2>Clasificación</h2>

      {ranking.map((r, i) => (
        <div key={r.userId}>
          #{i + 1} - {r.userId} → {r.points} pts
        </div>
      ))}
    </div>
  );
}
