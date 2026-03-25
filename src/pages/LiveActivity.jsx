import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function safeStr(v) {
  return String(v ?? "").trim();
}

function fmt(v) {
  if (!v) return "(not provided)";
  return String(v);
}

function fmtDate(v) {
  if (!v) return "(unknown)";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleString();
  } catch {
    return String(v);
  }
}

function shortResult(v) {
  const s = String(v || "").toUpperCase();
  if (s.includes("CLEAR")) return "CLEAR";
  if (s.includes("CAUTION")) return "CAUTION";
  return s || "ACTIVE";
}

export default function LiveActivity() {
  const nav = useNavigate();

  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const authorized = !!email && isBrokerOrShipper(email);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [record, setRecord] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!authorized) {
      nav("/login", { replace: true });
    }
  }, [authorized, nav]);

  if (!authorized) return null;

  async function safeJson(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  async function loadDetailByToken(token) {
    if (!token) return;

    setLoading(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await fetch("/api/manage_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "detail",
          token
        })
      });

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        setLoading(false);
        setErrorMsg(data?.error || "Verification detail not found.");
        return;
      }

      setRecord(data);
      setAttempts(Array.isArray(data.attempts) ? data.attempts : []);
      setStatusMsg("Verification loaded.");
      setLoading(false);
    } catch {
      setLoading(false);
      setErrorMsg("Network error loading verification.");
    }
  }

  async function runSearch() {
    const q = safeStr(query);
    if (!q) {
      setErrorMsg("Enter Verification ID, AdbS Verify Link, Load ID, email, phone, DOT, plate, or carrier");
      setStatusMsg("");
      setRecord(null);
      setAttempts([]);
      setMatches([]);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setStatusMsg("");
    setRecord(null);
    setAttempts([]);
    setMatches([]);

    try {
      const res = await fetch("/api/manage_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lookup",
          token: q
        })
      });

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        setLoading(false);
        setErrorMsg(data?.error || "Verification not found.");
        return;
      }

      const rows = Array.isArray(data.rows) ? data.rows : [];
      setMatches(rows);

      if (rows.length === 1) {
        await loadDetailByToken(rows[0].token);
        return;
      }

      setStatusMsg(`${rows.length} matching records found.`);
      setLoading(false);
    } catch {
      setLoading(false);
      setErrorMsg("Network error loading verification.");
    }
  }

  const pageWrap = {
    minHeight: "100vh",
    background: "transparent"
  };

  const outer = {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "18px 16px 48px"
  };

  const heroLogoWrap = {
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 10
  };

  const heroLogo = {
    width: 220,
    maxWidth: "90%"
  };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12,18,28,0.72)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)"
  };

  const title = {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 14,
    color: "#fff"
  };

  const sectionTitle = {
    fontWeight: 900,
    fontSize: 18,
    marginBottom: 12,
    color: "#fff"
  };

  const input = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.32)",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 16,
    outline: "none"
  };

  const buttonPrimary = {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 900
