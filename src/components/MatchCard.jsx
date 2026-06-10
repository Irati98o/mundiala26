import React from "react";

export default function MatchCard({ match, onPredict }) {

  const userPrediction = getUserPrediction(match.id);
  const locked = new Date() >= new Date(match.date);

  return (
    <div className="card">
      <h3>{match.home} vs {match.away}</h3>

      {locked ? (
        <p>🔒 Cerrado</p>
      ) : userPrediction ? (
        <p>✅ Apostado: {userPrediction.prediction}</p>
      ) : (
        <div>
          <button onClick={() => onPredict(match.id, "1")}>1</button>
          <button onClick={() => onPredict(match.id, "X")}>X</button>
          <button onClick={() => onPredict(match.id, "2")}>2</button>
        </div>
      )}
    </div>
  );
}
