import React from "react";
import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function Login({ setUser }) {
  const [name, setName] = useState("");

  const login = async () => {
    const q = query(collection(db, "users"), where("name", "==", name));
    const existing = await getDocs(q);

    if (!existing.empty) {
      alert("Nombre ya en uso");
      return;
    }

    const doc = await addDoc(collection(db, "users"), {
      name,
      points: 0,
      isAdmin: name === "Irati"
    });

    localStorage.setItem("userId", doc.id);
    setUser({ id: doc.id, name });
  };

  return (
    <div className="center">
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={login}>Entrar</button>
    </div>
  );
}
