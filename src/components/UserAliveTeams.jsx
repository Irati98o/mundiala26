import React from "react";

export default function UserAliveTeams({ jugadores, rondas }) {

  // equipos vivos = los que siguen en la ronda más avanzada disponible
  const obtenerEquiposVivos = () => {
    const fases = ["FIRST", "SECOND", "SF", "QF", "R16", "R32"];

    for (let fase of fases) {
      if (rondas[fase] && rondas[fase].length > 0) {
        return rondas[fase];
      }
    }
    return [];
  };

  const equiposVivos = obtenerEquiposVivos();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {jugadores.map((jugador, idx) => {

        const vivos = jugador.equipos.filter(e =>
          equiposVivos.includes(e)
        ).length;

        return (
          <div
            key={idx}
            style={{
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "10px",
              minWidth: "220px"
            }}
          >
            <h3>
              {jugador.nombre} ({vivos})
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {jugador.equipos.map((equipo, i) => {
                const sigueVivo = equiposVivos.includes(equipo);

                return (
                  <span
                    key={i}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      color: "white",
                      fontSize: "14px",
                      backgroundColor: sigueVivo ? "#28a745" : "#dc3545"
                    }}
                  >
                    {equipo}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
