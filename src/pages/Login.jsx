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
    // ✅ YA EXISTE → entrar
    const doc = existing.docs[0];

    localStorage.setItem("userId", doc.id);
    setUser({ id: doc.id, name });

    return;
  }

  // ✅ NO EXISTE → crear usuario nuevo
  const docRef = await addDoc(collection(db, "users"), {
    name,
    points: 0,
    koPoints: 0,
    isAdmin: name === "Irati"
  });

  localStorage.setItem("userId", docRef.id);
  setUser({ id: docRef.id, name });
};

  return (
    <div className="center">
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={login}>Entrar</button>
    </div>
  );
}
