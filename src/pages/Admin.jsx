import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { getAuthEmail, isBrokerOrShipper } from "../utils/auth.js";

function safeStr(v) {
  return String(v ?? "").trim();
}

function fmtDate(v) {
  if (!v) return "";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleString();
  } catch {
    return String(v);
  }
}

function maskKey(k) {
  const s = safeStr(k);
  if (!s) return "";
  if (s.length <= 6) return "••••••";
  return `${s.slice(0, 3)}••••••${s.slice(-3)}`;
}

async function safeCopy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function Admin() {
  const nav = useNavigate();

  const email = useMemo(() => safeStr(getAuthEmail()).toLowerCase(), []);
  const authorized = useMemo(() => !!email && isBrokerOrShipper(email), [email]);

  useEffect(() => {
    if (!authorized) nav("/login", { replace: true });
  }, [authorized, nav]);

  const [adminKey, setAdminKey] = useState(() => {
    try {
      return safeStr(sessionStorage.getItem("qc_admin_key"));
    } catch {
      return "";
    }
  });

  const [showAdminKey, setShowAdminKey] = useState(false);

  const [mode, setMode] = useState("pending");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(null);

  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [resetEmail, setResetEmail] = useState("");

  const offset = page * pageSize;

  function saveAdminKey(next) {
    setAdminKey(next);
    try {
      sessionStorage.setItem("qc_admin_key", next);
    } catch {}
  }

  async function loadList() {
    setErrorMsg("");
    setStatusMsg("");
    setLoading(true);

    try {
      const qs = new URLSearchParams();
      qs.set("status", mode);
      qs.set("limit", String(pageSize));
      qs.set("offset", String(offset));

      const res = await fetch(`/api/admin_beta_requests?${qs.toString()}`, {
        headers: {
          "x-adbs-admin-key": adminKey || "",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setRows([]);
        setTotal(null);
        setErrorMsg(data?.error || data?.message || `Admin list failed (${res.status}).`);
        setLoading(false);
        return;
      }

      setRows(Array.isArray(data?.rows) ? data.rows : []);
      setTotal(Number.isFinite(data?.total) ? data.total : null);
      setLoading(false);
    } catch {
      setRows([]);
      setTotal(null);
      setLoading(false);
      setErrorMsg("Network error loading beta requests.");
    }
  }

  useEffect(() => {
    if (!safeStr(adminKey)) return;
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, pageSize, page]);

  async function approveRow(rowId) {
    if (!rowId) return;
    setErrorMsg("");
    setStatusMsg("");
    setBusyId(rowId);

    try {
      const res = await fetch("/api/admin_beta_approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-adbs-admin-key": adminKey || "",
        },
        body: JSON.stringify({ id: rowId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setBusyId("");
        setErrorMsg(data?.error || data?.message || `Approve failed (${res.status}).`);
        return;
      }

      setStatusMsg(`Approved. Access code: ${data.access_code || "(none returned)"}`);
      setBusyId("");
      loadList();
    } catch {
      setBusyId("");
      setErrorMsg("Network error approving request.");
    }
  }

  async function resetAccessCode() {
    const e = safeStr(resetEmail).toLowerCase();
    if (!e) {
      setErrorMsg("Enter an email to reset.");
      return;
    }

    setErrorMsg("");
    setStatusMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin_reset_access_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-adbs-admin-key": adminKey || "",
        },
        body: JSON.stringify({ email: e }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoading(false);
        setErrorMsg(data?.error || data?.message || `Reset failed (${res.status}).`);
        return;
      }

      setLoading(false);
      setStatusMsg(`Reset OK. Access code: ${data.access_code || "(none returned)"}`);
      setResetEmail("");
      loadList();
    } catch {
      setLoading(false);
      setErrorMsg("Network error resetting access code.");
    }
  }

  const pageStyle = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 26, fontWeight: 950, margin: 0 };
  const sub = { opacity: 0.8, marginTop: 6, fontSize: 14, lineHeight: 1.45 };

  const label = { fontSize: 13, opacity: 0.9, marginBottom: 6 };
  const input = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 15,
    outline: "none",
  };

  const btn = (primary) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(140,190,255,0.20)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(0,0,0,0.18)",
    color: "#e6edf5",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
  });

  const pill = (active) => ({
    padding: "10px 12px",
    borderRadius: 999,
    border: active ? "1px solid rgba(140,190,255,0.55)" : "1px solid rgba(255,255,255,0.14)",
    background: active ? "rgba(40, 110, 190, 0.25)" : "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  const table = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    overflow: "hidden",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
  };

  const th = {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    padding: "12px 12px",
    background: "rgba(0,0,0,0.22)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    opacity: 0.85,
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    verticalAlign: "top",
    fontSize: 14,
    lineHeight: 1.35,
  };

  const muted = { opacity: 0.72, fontSize: 12 };

  const canLoad = !!safeStr(adminKey);

  return (
    <div style={pageStyle}>
      <Header />
      <div style={wrap}>
        <div style={card}>
          {/* remainder unchanged */}
        </div>
      </div>
    </div>
  );
}
