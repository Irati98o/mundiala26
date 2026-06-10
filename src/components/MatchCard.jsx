import React from "react";

export default function MatchCard({ match, onPredict, getUserPrediction }) {

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
          <button className={userPrediction?.prediction === "1" ? "active" : ""} onClick={() => onPredict(match.id, "1")}>1</button>
          <button className={userPrediction?.prediction === "X" ? "active" : ""} onClick={() => onPredict(match.id, "X")}>X</button>
          <button className={userPrediction?.prediction === "2" ? "active" : ""} onClick={() => onPredict(match.id, "2")}>2</button>
        </div>
      )}
    </div>
  );
}
