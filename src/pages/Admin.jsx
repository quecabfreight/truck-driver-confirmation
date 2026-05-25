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
        headers: { "x-adbs-admin-key": adminKey || "" },
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
        setErrorMsg(
          data?.detail ||
            data?.error ||
            data?.message ||
            `Approve failed (${res.status}).`
        );
        return;
      }

      setStatusMsg(
  `Approved. Access code: ${data.access_code || "(none returned)"}${
    data.email_status
      ? ` | Approval Email: ${data.email_status}`
      : ""
  }${
    data.email_error
      ? ` | Email Error: ${data.email_error}`
      : ""
  }`
);
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
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={h1}>Admin</div>
              <div style={sub}>
                Beta approvals + access codes. <br />
                Signed in as <b>{email}</b>.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button style={btn(false)} onClick={() => nav("/")}>Control Center</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14, marginTop: 14 }}>
            <div>
              <div style={label}>Admin Key (required for actions)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                <input
                  style={input}
                  value={adminKey}
                  onChange={(e) => saveAdminKey(e.target.value)}
                  placeholder="Enter ADBS_ADMIN_KEY"
                  type={showAdminKey ? "text" : "password"}
                  autoComplete="off"
                />
                <button type="button" style={btn(false)} onClick={() => setShowAdminKey((v) => !v)}>
                  {showAdminKey ? "Hide" : "Show"}
                </button>
              </div>
              <div style={muted}>Saved in this tab only. Current: {adminKey ? maskKey(adminKey) : "(none)"}.</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <button
                  style={btn(true)}
                  onClick={() => {
                    setPage(0);
                    loadList();
                  }}
                  disabled={!canLoad || loading}
                  title={!canLoad ? "Enter admin key first" : "Load list"}
                >
                  {loading ? "Loading..." : "Load / Refresh"}
                </button>
                <button
                  style={btn(false)}
                  onClick={() => {
                    saveAdminKey("");
                    setRows([]);
                    setTotal(null);
                    setStatusMsg("Admin key cleared.");
                    setErrorMsg("");
                  }}
                >
                  Clear Key
                </button>
              </div>
            </div>

            <div>
              <div style={label}>Reset Access Code by Email</div>
              <input
                style={input}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="email@company.com"
                inputMode="email"
                autoComplete="off"
              />
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <button style={btn(true)} onClick={resetAccessCode} disabled={!canLoad || loading}>
                  Reset Code
                </button>
                <button
                  style={btn(false)}
                  onClick={async () => {
                    const ok = await safeCopy(safeStr(resetEmail));
                    setStatusMsg(ok ? "Email copied." : "Copy failed.");
                  }}
                >
                  Copy Email
                </button>
              </div>
            </div>
          </div>

          {errorMsg ? (
            <div style={{
              marginTop: 12,
              border: "1px solid rgba(255,80,80,0.35)",
              background: "rgba(255,80,80,0.08)",
              padding: 12,
              borderRadius: 12,
              fontSize: 14,
            }}>
              <b>Error:</b> {errorMsg}
            </div>
          ) : null}

          {statusMsg ? (
            <div style={{
              marginTop: 12,
              border: "1px solid rgba(120,180,255,0.30)",
              background: "rgba(120,180,255,0.08)",
              padding: 12,
              borderRadius: 12,
              fontSize: 14,
            }}>
              {statusMsg}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
            <button style={pill(mode === "pending")} onClick={() => { setMode("pending"); setPage(0); }}>
              Pending
            </button>
            <button style={pill(mode === "approved")} onClick={() => { setMode("approved"); setPage(0); }}>
              Approved
            </button>
            <button style={pill(mode === "all")} onClick={() => { setMode("all"); setPage(0); }}>
              All
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={muted}>{total === null ? "Total: —" : `Total: ${total}`}</div>

              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value) || 25); setPage(0); }}
                style={{ ...input, width: 120, padding: "10px 10px", fontSize: 13 }}
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>

              <button style={btn(false)} onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                Prev
              </button>

              <button
                style={btn(false)}
                onClick={() => setPage((p) => p + 1)}
                disabled={total !== null ? (offset + pageSize >= total) : false}
              >
                Next
              </button>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Created</th>
                  <th style={th}>Email</th>
                  <th style={th}>Name / Business</th>
                  <th style={th}>Role</th>
                  <th style={th}>MC / DOT</th>
                  <th style={th}>Phone</th>
                  <th style={th}>Access Code</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td style={{ ...td, opacity: 0.75 }} colSpan={8}>
                      {canLoad ? "No rows found for this filter." : "Enter Admin Key and click Load / Refresh."}
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const id = safeStr(r.id);
                    const created = fmtDate(r.created_at);
                    const rEmail = safeStr(r.email || r.business_email || r.contact_email);
                    const name = safeStr(r.legal_business_name || r.legal_name || r.name || r.business_name);
                    const role = safeStr(r.role);
                    const mc = safeStr(r.mc_number || r.mc || r.mc_num);
                    const dot = safeStr(r.usdot || r.usdot_number || r.usdot_on_record);
                    const phone = safeStr(r.business_phone || r.phone);
                    const code = safeStr(r.access_code);
                    const approved = r.approved === true || safeStr(r.status).toLowerCase() === "approved";

                    return (
                      <tr key={id || created}>
                        <td style={td}>
                          <div>{created}</div>
                          <div style={muted}>id: {id || "(none)"}</div>
                        </td>
                        <td style={td}>
                          <div style={{ fontWeight: 900 }}>{rEmail || "(missing)"}</div>
                        </td>
                        <td style={td}>
                          <div style={{ fontWeight: 900 }}>{name || "(missing)"}</div>
                          {r.contact_name ? <div style={muted}>Contact: {safeStr(r.contact_name)}</div> : null}
                        </td>
                        <td style={td}>{role || "—"}</td>
                        <td style={td}>
                          <div>{mc ? `MC: ${mc}` : "MC: —"}</div>
                          <div>{dot ? `USDOT: ${dot}` : "USDOT: —"}</div>
                        </td>
                        <td style={td}>{phone || "—"}</td>
                        <td style={td}>
                          <div style={{ fontWeight: 900 }}>{code || "—"}</div>
                          <div style={muted}>{approved ? "approved" : "pending"}</div>
                        </td>
                        <td style={td}>
                          <div style={{ display: "grid", gap: 8 }}>
                            {!approved ? (
                              <button
                                style={btn(true)}
                                onClick={() => approveRow(id)}
                                disabled={!canLoad || busyId === id}
                                title={!id ? "Missing id" : "Approve + generate access code"}
                              >
                                {busyId === id ? "Approving..." : "Approve"}
                              </button>
                            ) : (
                              <button
                                style={btn(false)}
                                onClick={async () => {
                                  const ok = await safeCopy(code || "");
                                  setStatusMsg(ok ? "Access code copied." : "Copy failed.");
                                }}
                                disabled={!code}
                              >
                                Copy Code
                              </button>
                            )}

                            <button
                              style={btn(false)}
                              onClick={async () => {
                                const ok = await safeCopy(rEmail || "");
                                setStatusMsg(ok ? "Email copied." : "Copy failed.");
                              }}
                              disabled={!rEmail}
                            >
                              Copy Email
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div style={{ marginTop: 10, ...muted }}>
              Tip: This page does not auto-refresh. Use Load / Refresh.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
