import React from "react";
import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {

  const [user, setUser] = useState(null);

  if (!user) return <Login setUser={setUser} />;

  return <Home user={user} />;
}
