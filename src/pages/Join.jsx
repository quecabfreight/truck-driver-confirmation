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

    const { error } = await supabase.from("beta_requests").insert([
      {
        ...form,
        beta_acknowledged: true,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      setStatus("❌ Submission failed: " + error.message);
      return;
    }

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

  return (
    <div style={{ padding: 40, color: "#fff", maxWidth: 600 }}>
      <h1>Request Access</h1>

      <form onSubmit={submit}>
        <input
          placeholder="Legal Business Name"
          value={form.legal_business_name}
          onChange={(e) => update("legal_business_name", e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Primary Contact Name"
          value={form.primary_contact_name}
          onChange={(e) => update("primary_contact_name", e.target.value)}
        />
        <br /><br />

        <select
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Broker">Broker</option>
          <option value="Shipper">Shipper</option>
        </select>
        <br /><br />

        <input
          placeholder="MC Number"
          value={form.mc_number}
          onChange={(e) => update("mc_number", e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Business Phone"
          value={form.business_phone}
          onChange={(e) => update("business_phone", e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Business Email"
          value={form.business_email}
          onChange={(e) => update("business_email", e.target.value)}
        />
        <br /><br />

        <label>
          <input
            type="checkbox"
            checked={form.beta_acknowledged}
            onChange={(e) => update("beta_acknowledged", e.target.checked)}
          />{" "}
          I acknowledge this is beta software
        </label>

        <br /><br />

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  );
}
