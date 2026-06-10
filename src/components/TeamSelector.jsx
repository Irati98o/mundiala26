import { useState } from "react";

export default function TeamSelector({ teams, save }) {

  const [selected, setSelected] = useState([]);

  const toggle = (team) => {
    if (selected.includes(team)) {
      setSelected(selected.filter(t => t !== team));
    } else if (selected.length < 16) {
      setSelected([...selected, team]);
    }
  };

  return (
    <div>
      {teams.map(t => (
        <button key={t} onClick={() => toggle(t)}>
          {t}
        </button>
      ))}

      <button onClick={() => save(selected)}>
        Guardar
      </button>
    </div>
  );
}
