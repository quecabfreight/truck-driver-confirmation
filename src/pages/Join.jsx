import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Join() {
  const [form, setForm] = useState({
    legal_business_name: "",
    primary_contact_name: "",
    role: "",
    mc_number: "",
    business_phone: "",
    business_email: "",
    beta_acknowledged: false,
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const { error } = await supabase.from("beta_requests").insert([
        {
          ...form,
          business_email: (form.business_email || "").trim().toLowerCase(),
          beta_acknowledged: true,
        },
      ]);

      if (error) {
        console.error(error);
        setStatus("❌ Submission failed: " + error.message);
      } else {
        setStatus("✅ Request submitted successfully.");
        setForm({
          legal_business_name: "",
          primary_contact_name: "",
          role: "",
          mc_number: "",
          business_phone: "",
          business_email: "",
          beta_acknowledged: false,
        });
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ App error: " + (err?.message || "Unknown error"));
    }

    setLoading(false);
  }

  return (
    <div style={{ width: "min(900px, 100%)" }}>
      <div style={styles.card}>
        <h1 style={styles.title}>Request Access</h1>
        <p style={styles.sub}>
          If you can see this, the white-screen problem is gone.
        </p>

        <form onSubmit={submit}>
          <label style={styles.label}>Legal Business Name</label>
          <input
            style={styles.input}
            value={form.legal_business_name}
            onChange={(e) => update("legal_business_name", e.target.value)}
          />

          <label style={styles.label}>Primary Contact Name</label>
          <input
            style={styles.input}
            value={form.primary_contact_name}
            onChange={(e) => update("primary_contact_name", e.target.value)}
          />

          <label style={styles.label}>Role</label>
          <select
            style={styles.input}
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Broker">Broker</option>
            <option value="Shipper">Shipper</option>
          </select>

          <label style={styles.label}>MC#</label>
          <input
            style={styles.input}
            value={form.mc_number}
            onChange={(e) => update("mc_number", e.target.value)}
          />

          <label style={styles.label}>Business Phone</label>
          <input
            style={styles.input}
            value={form.business_phone}
            onChange={(e) => update("business_phone", e.target.value)}
          />

          <label style={styles.label}>Business Email</label>
          <input
            style={styles.input}
            value={form.business_email}
            onChange={(e) => update("business_email", e.target.value)}
          />

          <label style={{ ...styles.label, display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={form.beta_acknowledged}
              onChange={(e) => update("beta_acknowledged", e.target.checked)}
            />
            I acknowledge this is beta software
          </label>

          <button style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        {status ? <div style={styles.status}>{status}</div> : null}
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    padding: 22,
  },
  title: { margin: 0, fontSize: 30 },
  sub: { marginTop: 8, color: "rgba(233,238,247,0.75)" },
  label: { display: "block", marginTop: 12, marginBottom: 6, fontWeight: 800 },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.22)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 16,
    boxSizing: "border-box",
  },
  button: {
    marginTop: 16,
    border: "none",
    borderRadius: 999,
    padding: "12px 18px",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
    color: "#06120b",
    background: "rgba(45, 230, 130, 1)",
  },
  status: { marginTop: 14, fontWeight: 900 },
};
