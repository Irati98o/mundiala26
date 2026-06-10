import React from "react";
import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

export default function Login({ setUser }) {
  const [name, setName] = useState("");

  const login = async () => {

    const userRef = doc(db, "users", name);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      // ✅ Usuario ya existe → entrar
      localStorage.setItem("userId", name);
      setUser({ id: name, name });
      return;
    }

    // ✅ Usuario nuevo → crear con ID = nombre
    await setDoc(userRef, {
      name: name,
      points: 0,
      koPoints: 0,
      isAdmin: name === "Irati"
    });

    localStorage.setItem("userId", name);
    setUser({ id: name, name });
  };

  return (
    <div className="center">
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={login}>Entrar</button>
    </div>
  );
}
