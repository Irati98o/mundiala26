import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import Bracket from "../components/Bracket";

export default function KOPhase() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "matches"), snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // agrupar por fase
  const rounds = [
    {
      name: "Dieciseiabos",
      key: "R32"
    },
    {
      name: "Octavos",
      key: "R16"
    },
    {
      name: "Cuartos",
      key: "QF"
    },
    {
      name: "Semis",
      key: "SF"
    },
    {
      name: "Final",
      key: "F"
    }
  ];

  const structured = rounds.map(r => ({
    ...r,
    matches: matches.filter(m => m.round === r.key)
  }));

  return <Bracket rounds={structured} />;
}
