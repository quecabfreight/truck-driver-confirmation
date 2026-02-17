import { useMemo, useState } from "react";

export default function Admin() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem("adbs_admin_key") || "");
  const [statusMsg, setStatusMsg] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Approval result banner
  const [approvedBanner, setApprovedBanner] = useState(null); // { email, code }

  // Diagnostics (hidden by default)
  const [showDiag, setShowDiag] = useState(false);
  const [diag, setDiag] = useState("");

  const locked = useMemo(() => !adminKey.trim(), [adminKey]);

  async function postJson(url, payload) {
    setDiag("");
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      });

      const text = await r.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }

      if (showDiag) {
        const pretty = json ? JSON.stringify(json, null, 2) : text;
        setDiag(
          [
            `URL: ${url}`,
            `HTTP: ${r.status} ${r.statusText || ""}`.trim(),
            `--- BODY ---`,
            pretty.length > 2500 ? pretty.slice(0, 2500) + "\n…(truncated)…" : pretty,
          ].join("\n")
        );
      }

      return { ok: r.ok, status: r.status, json, text };
    } catch (e) {
      if (showDiag) setDiag(`Network error calling ${url}\n${String(e?.message || e)}`);
      return { ok: false, status: 0, json: null, text: "" };
    }
  }

  async function loadRequests() {
    setApprovedBanner(null);
    setStatusMsg("Loading requests…");
    setLoading(true);
    setRows([]);

    const out = await postJson("/api/admin_list_beta_requests", { admin_key: adminKey });

    if (out.json?.ok) {
      const list = Array.isArray(out.json.rows) ? out.json.rows : [];
      setRows(list);
      setStatusMsg(`Loaded ${list.length} request(s).`);
      setLoading(false);
      return;
    }

    const msg = out.json?.error
      ? `Error: ${out.json.error}`
      : out.status
      ? `Error loading requests (HTTP ${out.status}).`
      : "Error loading requests.";
    setStatusMsg(msg);
    setLoading(false);
  }

  async function approveRequest(id, email) {
    setStatusMsg("Approving…");
    setLoading(true);
    setApprovedBanner(null);

    const out = await postJson("/api/admin_approve_beta_request", { admin_key: adminKey, id });

    if (out.json?.ok) {
      const code = String(out.json.access_code || "").toUpperCase();
      setApprovedBanner({ email: email || "Applicant", code: code || "(no code returned)" });
      setStatusMsg("Approved.");
      await loadRequests();
      setLoading(false);
      return;
    }

    const msg = out.json?.error
      ? `Error: ${out.json.error}`
      : out.status
      ? `Error approving (HTTP ${out.status}).`
      : "Error approving.";
    setStatusMsg(msg);
    setLoading(false);
  }

  async function copy(text) {
    const t = String(text || "");
    if (!t) return;

    try {
      await navigator.clipboard.writeText(t);
      setStatusMsg("Copied.");
      setTimeout(() => setStatusMsg((s) => (s === "Copied." ? "" : s)), 1200);
    } catch {
      // Fallback
      window.prompt("Copy this code:", t);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
        </a>

        <div style={styles.card}>
          <div style={styles.title}>Admin — Access Requests</div>
          <div style={styles.sub}>Enter the Admin Key to view and approve Request Access submissions.</div>

          <div style={styles.row}>
            <input
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter Admin Key"
              style={styles.input}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              onClick={() => {
                localStorage.setItem("adbs_admin_key", adminKey);
                loadRequests();
              }}
              disabled={locked || loading}
              style={{
                ...styles.button,
                opacity: locked || loading ? 0.6 : 1,
                cursor: locked || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Working…" : "Load Requests"}
            </button>
          </div>

          {!!approvedBanner && (
            <div style={styles.banner}>
              <div style={styles.bannerTitle}>Approved</div>
              <div style={styles.bannerText}>
                <span style={{ opacity: 0.9 }}>{approvedBanner.email}</span>
              </div>

              <div style={styles.bannerCodeRow}>
                <div style={styles.bannerCode}>{approvedBanner.code}</div>
                <button style={styles.copyBtn} onClick={() => copy(approvedBanner.code)}>
                  Copy Code
                </button>
              </div>

              <div style={styles.bannerHint}>
                Send this code to the applicant (manual for now). They can log in immediately once approved.
              </div>
            </div>
          )}

          {statusMsg ? <div style={styles.status}>{statusMsg}</div> : null}

          <div style={styles.tableWrap}>
            <div style={styles.tableHead}>Latest 50 requests</div>

            {rows.length === 0 ? (
              <div style={styles.empty}>No requests loaded yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Created</th>
                      <th style={styles.th}>Business Email</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Access Code</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((r) => {
                      const id = r.id;
                      const created = formatDate(r.created_at);
                      const email = r.business_email || "—";
                      const st = (r.status || "pending").toString();
                      const approved = st.toLowerCase() === "approved" || r.approved === true;

                      const code = String(r.access_code || "").toUpperCase();

                      return (
                        <tr key={id} style={styles.tr}>
                          <td style={styles.td}>{created}</td>
                          <td style={styles.td}>{email}</td>
                          <td style={styles.td}>{approved ? "approved" : st}</td>
                          <td style={styles.td}>
                            {code ? (
                              <div style={styles.codeCell}>
                                <span style={styles.codePill}>{code}</span>
                                <button style={styles.copyMini} onClick={() => copy(code)} title="Copy code">
                                  Copy
                                </button>
                              </div>
                            ) : (
                              <span style={{ opacity: 0.7 }}>—</span>
                            )}
                          </td>
                          <td style={styles.td}>
                            {approved ? (
                              <span style={{ fontWeight: 900, opacity: 0.9 }}>Approved</span>
                            ) : (
                              <button
                                onClick={() => approveRequest(id, email)}
                                style={{
                                  ...styles.approveBtn,
                                  opacity: loading ? 0.7 : 1,
                                  cursor: loading ? "not-allowed" : "pointer",
                                }}
                                disabled={loading}
                              >
                                Approve + Generate Code
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={styles.diagRow}>
            <button
              style={styles.diagLink}
              onClick={() => {
                setShowDiag((v) => !v);
                setDiag("");
              }}
              type="button"
            >
              {showDiag ? "Hide diagnostics" : "Show diagnostics"}
            </button>
          </div>

          {showDiag ? (
            <div style={styles.debugWrap}>
              <div style={styles.debugTitle}>Diagnostics</div>
              <pre style={styles.debugPre}>{diag || "No diagnostics yet. Click Load Requests or Approve."}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatDate(v) {
  if (!v) return "—";
  try {
    const d = new Date(v);
    return d.toLocaleString();
  } catch {
    return String(v);
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(58, 110, 160, 0.20), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(30, 80, 140, 0.18), transparent 55%), #06090f",
    color: "#e9eef7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  shell: { width: "100%", maxWidth: 1100 },
  brandLink: { display: "inline-flex", alignItems: "center", marginBottom: 14 },
  logo: { width: 220, height: "auto" },

  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },

  title: { fontSize: 22, fontWeight: 900, marginBottom: 6 },
  sub: { fontSize: 14, opacity: 0.85, marginBottom: 14 },

  row: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  input: {
    flex: "1 1 420px",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.25)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 16,
  },
  button: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background: "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 16,
  },

  status: { marginTop: 10, fontSize: 14, opacity: 0.92 },

  banner: {
    marginTop: 14,
    borderRadius: 14,
    border: "1px solid rgba(120, 190, 255, 0.25)",
    background: "rgba(20, 35, 60, 0.55)",
    padding: 14,
  },
  bannerTitle: { fontSize: 14, fontWeight: 900, letterSpacing: 0.2, marginBottom: 4 },
  bannerText: { fontSize: 14, marginBottom: 10 },
  bannerCodeRow: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  bannerCode: {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: 1.0,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(10, 14, 22, 0.55)",
  },
  copyBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(36, 110, 210, 0.85)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  bannerHint: { marginTop: 10, fontSize: 13, opacity: 0.82 },

  tableWrap: {
    marginTop: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  tableHead: { padding: 12, background: "rgba(255,255,255,0.05)", fontSize: 14, opacity: 0.9 },
  empty: { padding: 16, opacity: 0.85 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "12px 12px", fontWeight: 900, whiteSpace: "nowrap" },
  td: { padding: "12px 12px", verticalAlign: "top", whiteSpace: "nowrap" },
  tr: { borderTop: "1px solid rgba(255,255,255,0.08)" },

  approveBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(20, 130, 80, 0.85)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 900,
  },

  codeCell: { display: "flex", alignItems: "center", gap: 8 },
  codePill: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(10, 14, 22, 0.45)",
    fontWeight: 900,
    letterSpacing: 0.6,
  },
  copyMini: {
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(36, 110, 210, 0.65)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  },

  diagRow: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  diagLink: {
    border: "none",
    background: "transparent",
    color: "rgba(180, 210, 255, 0.9)",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
    padding: 0,
  },

  debugWrap: {
    marginTop: 10,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  debugTitle: {
    padding: 12,
    background: "rgba(255,255,255,0.05)",
    fontSize: 14,
    opacity: 0.9,
    fontWeight: 900,
  },
  debugPre: {
    margin: 0,
    padding: 12,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: 12,
    lineHeight: 1.4,
    color: "rgba(233,238,247,0.92)",
  },
};
