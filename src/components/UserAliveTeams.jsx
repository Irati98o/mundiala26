import React from "react";

export default function UserAliveTeams({ jugadores, rondas }) {

  // equipos vivos = los que siguen en la ronda más avanzada disponible
  const obtenerEquiposVivos = () => {
    const orden = ["R32", "R16", "QF", "SF", "SECOND", "FIRST"];
    const tamañoRondas = {
      R32: 32,
      R16: 16,
      QF: 8,
      SF: 4,
      SECOND: 2,
      FIRST: 1
    };

    for (let i = 0; i < orden.length; i++) {
      const fase = orden[i];
      const siguiente = orden[ + 1];

      const equiposActual = rondas[fase] || [];
      const equiposSiguiente = rondas[siguiente] || [];
    
      if (!siguiente || equiposSiguiente.length < tamañoRondas[siguiente]){
        return equiposActual;
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
            <h3 style={{
              color:
                vivos >= 3 ? "#28a745" :
                vivos === 2 ? "#ff9800" :
                "#dc3545"
              }}
            >
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
