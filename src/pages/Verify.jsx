import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Verify() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr("");
      setExists(false);

      try {
        const t = (token || "").trim();
        if (!t) {
          setErr("Invalid verification link.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("verify_links")
          .select("token")
          .eq("token", t)
          .limit(1);

        if (error) throw error;

        if (!alive) return;
        setExists(Array.isArray(data) && data.length > 0);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setErr("Could not load verification link. Check Supabase policies.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
        </a>

        <div style={styles.card}>
          <div style={styles.title}>Dock Verify</div>

          {loading ? <div style={styles.notice}>Loading…</div> : null}
          {err ? <div style={styles.error}>{err}</div> : null}

          {!loading && !err ? (
            exists ? (
              <div style={styles.notice}>Link OK. Token found.</div>
            ) : (
              <div style={styles.error}>Verification link not found.</div>
            )
          ) : null}

          <div style={styles.small}>
            Token: <b>{token}</b>
          </div>
        </div>

        <div style={styles.footer}>© {new Date().getFullYear()} QueCab AdbS</div>
      </div>
    </div>
  );
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
  shell: { width: "100%", maxWidth: 760 },
  brandLink: { display: "inline-flex", alignItems: "center", marginBottom: 14 },
  logo: { width: 220, height: "auto" },
  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  title: { fontSize: 22, fontWeight: 900, marginBottom: 10 },
  notice: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(40, 90, 150, 0.14)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    marginBottom: 10,
  },
  error: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(170, 30, 30, 0.18)",
    border: "1px solid rgba(255, 80, 80, 0.28)",
    color: "#ffd7d7",
    marginBottom: 10,
  },
  small: { marginTop: 10, fontSize: 12, color: "rgba(233, 238, 247, 0.7)" },
  footer: {
    marginTop: 14,
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.55)",
    textAlign: "center",
  },
};
