import React from "react";

export default function TournamentProgress({ rondas }) {

  const fasesOrdenadas = [
    "R32",
    "R16",
    "QF",
    "SF",
    "SECOND",
    "FIRST"
  ];

  return (
    <div style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
      {fasesOrdenadas.map(fase => (
        <div key={fase}>
          <h3>{fase}</h3>

          {(rondas[fase] || []).map((team, i) => (
            <div
              key={i}
              style={{
                padding: "6px",
                marginBottom: "4px",
                background: "#eee",
                borderRadius: "6px"
              }}
            >
              {team}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
