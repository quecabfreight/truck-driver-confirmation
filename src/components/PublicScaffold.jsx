import React from "react";
import PublicHeader from "./PublicHeader";

export default function PublicScaffold({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0f1722", color: "#e6edf5" }}>
      <PublicHeader />
      {children}
    </div>
  );
}
