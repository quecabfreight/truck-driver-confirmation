import { useEffect, useMemo, useState } from "react";

export default function Admin() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem("adbs_admin_key") || "");
  const [statusMsg, setStatusMsg] = useState("");
  const [rows, setRows] = useState([]);
  const [approvedCodes, setApprovedCodes] = useState({}); // id -> code

  const locked = useMemo(() => !adminKey.trim(), [adminKey]);

  async function load() {
    setStatusMsg("Loading requests…");
    try {
      const r = await fetch("/api/admin_list_beta_requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_key: adminKey }),
      });

      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.ok) {
        setStatusMsg(j?.error ? `Error: ${j.error}` : "Error loading requests.");
        return;
      }

      const list = Array.isArray(j.rows) ? j.rows : [];
      setRows(list);
      setStatusMsg(`Loaded ${list.length} request(s).`);
    } catch (e) {
      setStatusMsg(`Error: ${String(e?.message || e)}`);
    }
  }

  async function approve(id) {
    setStatusMsg("Approving…");
    try {
      const r = await fetch("/api/admin_approve_beta_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_key: adminKey, id }),
      });

      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.ok) {
        setStatusMsg(j?.error ? `Error: ${j.error}` : "Error approving.");
        return;
      }

      setApprovedCodes((p) => ({ ...p, [id]: j.access_code }));
      setStatusMsg("Approved. Access Code generated.");
      await load();
    } catch (e) {
      setStatusMsg(`Error: ${String(e?.message || e)}`);
    }
  }

  useEffect(() => {
    if (!locked) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
        </a>

        <div style={styles.card}>
          <div style={styles.title}>Admin — Access Requests</div>
          <div style={styles.sub}>
            Enter the Admin Key to view and approve Request Access submissions.
          </div>

          <div style={styles.row}>
            <input
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter Admin Key"
              style={{ ...styles.input, letterSpacing: 0.6 }}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              onClick={() => {
                localStorage.setItem("adbs_admin_key", adminKey);
                load();
              }}
              disabled={locked}
              style={{
                ...styles.button,
                opacity: locked ? 0.6 : 1,
                cursor: locked ? "not-allowed" : "pointer",
              }}
            >
              Load Requests
            </button>
          </div>

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
                      <th style={styles.th}>Name / Business</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const id = r.id;
                      const created = formatDate(r.created_at);
                      const email = r.business_email || "—";
                      const name =
                        r.name ||
                        r.legal_name ||
                        r.legal_business_name ||
                        r.business_name ||
                        "—";
                      const role = r.role || "—";
                      const phone = r.business_phone || r.phone || "—";
                      const st = (r.status || "pending").toString();
                      const code = approvedCodes[id] || r.access_code || "";

                      const approved = st.toLowerCase() === "approved" || r.approved === true;

                      return (
                        <tr key={id} style={styles.tr}>
                          <td style={styles.td}>{created}</td>
                          <td style={styles.td}>{email}</td>
                          <td style={styles.td}>{name}</td>
                          <td style={styles.td}>{role}</td>
                          <td style={styles.td}>{phone}</td>
                          <td style={styles.td}>{approved ? "approved" : st}</td>
                          <td style={styles.td}>
                            {approved ? (
                              <div>
                                <div style={{ fontWeight: 900 }}>Approved</div>
                                {code ? (
                                  <div style={{ marginTop: 6 }}>
                                    <span style={{ opacity: 0.8 }}>Access Code: </span>
                                    <span style={{ fontWeight: 900, letterSpacing: 1.2 }}>{String(code).toUpperCase()}</span>
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <button onClick={() => approve(id)} style={styles.approveBtn}>
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

          <div style={styles.tip}>
            Tip: This page is your “key desk.” Approve someone → copy their code → they can log in.
          </div>
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
  status: { marginTop: 10, fontSize: 14, opacity: 0.9 },

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
    cursor: "pointer",
  },

  tip: { marginTop: 14, opacity: 0.75, fontSize: 13 },
};
