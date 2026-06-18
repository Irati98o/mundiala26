import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export default function GroupTable() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "matches"), snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  // ✅ solo partidos finalizados
  const finishedMatches = matches.filter(m => m.status === "FT");

  // ✅ agrupar por grupos
  const groups = {};

  finishedMatches.forEach(match => {
    const group = match.group;

    if (!groups[group]) {
      groups[group] = {};
    }

    const home = match.home;
    const away = match.away;

    const homeGoals = match.score.home;
    const awayGoals = match.score.away;

    // inicializar equipos
    if (!groups[group][home]) {
      groups[group][home] = initTeam();
    }

    if (!groups[group][away]) {
      groups[group][away] = initTeam();
    }

    // actualizar stats
    updateStats(groups[group][home], homeGoals, awayGoals);
    updateStats(groups[group][away], awayGoals, homeGoals);
  });

  function initTeam() {
    return {
      played: 0,
      win: 0,
      draw: 0,
      loss: 0,
      gf: 0,
      gc: 0,
      points: 0
    };
  }

  function updateStats(team, gf, gc) {
    team.played++;
    team.gf += gf;
    team.gc += gc;

    if (gf > gc) {
      team.win++;
      team.points += 3;
    } else if (gf < gc) {
      team.loss++;
    } else {
      team.draw++;
      team.points += 1;
    }
  }

  return (
    <div>
      <h2>Clasificación por grupos</h2>

      {Object.entries(groups).map(([groupName, teams]) => {

        const sortedTeams = Object.entries(teams)
          .map(([name, stats]) => ({
            name,
            ...stats,
            dg: stats.gf - stats.gc
          }))
          .sort((a, b) =>
            b.points - a.points ||
            b.dg - a.dg ||
            b.gf - a.gf
          );

        return (
          <div key={groupName} style={{ marginBottom: "20px" }}>
            <h3>Grupo {groupName}</h3>

            <table style={{ width: "100%", textAlign: "left" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PE</th>
                  <th>PP</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((t, i) => (
                  <tr key={t.name}>
                    <td>{i + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.played}</td>
                    <td>{t.win}</td>
                    <td>{t.draw}</td>
                    <td>{t.loss}</td>
                    <td>{t.gf}</td>
                    <td>{t.gc}</td>
                    <td>{t.dg}</td>
                    <td>{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        );
      })}
    </div>
  );
}
