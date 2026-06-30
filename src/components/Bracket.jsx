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
  
  const colores = {
      R32: "#e0e0e0",
      R16: "#90caf9",
      QF: "#ffb74d",
      SF: "#ba68c8",
      SECOND: "#c0c0c0",
      FIRST: "#ffd700"
  };

  return (
    <div style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
      {fasesOrdenadas.map((fase, idx) => (
        <div key={fase} style={{ minWidth: "140px" }}>
          <h3 style={{ textAlign: "center" }}>{fase}</h3>

          {(rondas[fase] || []).map((team, i) => (
            <div
              key={i}
              style={{
                padding: "6px",
                marginBottom: "6px",
                borderRadius: "6px",
                background: colores[fase],
                textAlign: "center",
                fontSize: "14px"
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
