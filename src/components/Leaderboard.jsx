import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc } from "firebase/firestore";


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

export default function Leaderboard() {
  const [predictions, setPredictions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [rondas, setRondas] = useState({});

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "predictions"), snap => {
      setPredictions(snap.docs.map(d => d.data()));
    });

    const unsub2 = onSnapshot(collection(db, "matches"), snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsub3 = onSnapshot(collection(db, "user_predictions_teams"), snap => {
      setUserTeams(snap.docs.map(d => ({id: d.id, ...d.data() })));
    });  

    const fases = ["R32", "R16", "QF", "SF", "FOURTH", "THIRD", "SECOND", "FIRST"];

    const unsubsFases = fases.map(fase => onSnapshot(doc(db, "tournamentResults", fase), snap => {
      if (snap.exists()) {
        setRondas(prev => ({...prev, [fase]: snap.data().teams || [] }));
      }
    }));

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsubsFases.forEach(u => u());
    };
  }, []);

  const equiposPorUsuario = {};
  
  userTeams.forEach(user => {
    const nombre = user.id.replace("_teams", "");
  
    equiposPorUsuario[nombre] = user.teams || [];
  });

  const getResult = (match) => {
    if (!match.score) return null;
    const home = match.score.home;
    const away = match.score.away;

    if (home > away) return "1";
    if (home < away) return "2";
    return "X";
  };

  const calcularPuntosEquipos = (equiposJugador, rondas) => {
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
      leaderboard[p.userId] = {
        base: 0,
        equipos: 0,
        total: 0
      };
    }

    leaderboard[p.userId].base += points;
  });

  Object.keys(leaderboard).forEach(userId => {
    const equipos = equiposPorUsuario[userId] || [];
    
    const puntosEquipos = calcularPuntosEquipos(equipos, rondas);
    
    leaderboard[userId].equipos = puntosEquipos;
    leaderboard[userId].total =
      leaderboard[userId].base + puntosEquipos;
  });

  // convertir a array y ordenar
  const ranking = Object.entries(leaderboard)
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.total - a.total);
  
  return (
    <div>
      <h2>Clasificación</h2>
  
      {ranking.map((r, i) => (
        <div
          key={r.userId}
          style={{
            padding: "8px",
            borderBottom: "1px solid #ddd"
          }}
        >
          <strong>#{i + 1} - {r.userId}</strong>
  
          <div>🎯 Apuestas: {r.base}</div>
          <div>🏆 Equipos: {r.equipos}</div>
          <div><strong>Total: {r.total} pts</strong></div>
        </div>
      ))}
    </div>
  );
}
