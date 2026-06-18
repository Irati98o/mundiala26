import React from "react";

export default function MatchCard({ match, onPredict, getUserPrediction }) {

  const userPrediction = getUserPrediction(match.id);
  const locked = new Date() >= new Date(match.date);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();

    return date.toLocaleString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"  
    });
  };

  let cardStyle = "card";

  if (locked){
    cardStyle += " locked";
  } else if (userPrediction) {
    cardStyle += " predicted";
  }
  
  return (
    <div className={cardStyle}>
      <div style={{fontSize:"12px", color:"#666"}}>
        {formatDate(match.date)}
      </div>  
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
