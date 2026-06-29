import React from "react";

export default function Bracket({ rounds }) {
  const renderMatch = (match) => (
    <div className="match">
      <div>{match.home}</div>
      <div>{match.away}</div>
      {match.score && (
        <div style={{ fontSize: "12px" }}>
          {match.score.home} - {match.score.away}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {rounds.map((round, i) => (
        <div key={i}>
          <h3>{round.name}</h3>
          {round.matches.map((m, idx) => (
            <div key={idx} style={{ marginBottom: "20px" }}>
              {renderMatch(m)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
