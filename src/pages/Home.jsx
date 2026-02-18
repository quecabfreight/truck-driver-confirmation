import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  useEffect(() => {
    // If anything routes here (legacy), send to the real dashboard.
    nav("/dashboard", { replace: true });
  }, [nav]);

  return null;
}
