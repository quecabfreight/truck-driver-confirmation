import React, { useState } from "react";

const JOIN_REQUESTS_KEY = "adbsv1_joinRequests";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function saveJoinRequest(entry) {
  try {
    const raw = localStorage.getItem(JOIN_REQUESTS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const arr = Array.isArray(existing) ? existing : [];
    const updated = [...arr, entry].slice(-50); // keep last 50
    localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors in demo
  }
}

export default function Join() {
  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    role: "Broker",
    mcNumber: "",
    ein: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState("idle"); // idle | success

  const updateField = (field) => (e) => {
    let value = e.target.value;

    if (field === "phone") {
      value = formatPhone(value);
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("idle");

    const payload = {
      ...form,
      timestamp: Date.now(),
    };

    saveJoinRequest(payload);
    setStatus("success");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "32px 30px 28px",
          borderRadius: "20px",
          width: "720px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 20px 55px rgba(0,0,0,0.75)",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            marginBottom: "6px",
          }}
        >
          Request Access
        </h1>
        <p
          style={{
            fontSize: "14px",
            opacity: 0.85,
            marginBottom: "18px",
          }}
        >
          For licensed brokers and shippers who want to deploy QueCab AdbS to
          verify Truck-Driver links in front of the dock.
        </p>

        <form onSubmit={handleSubmit}>
          {/* TOP ROW: LEGAL NAME / CONTACT NAME */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 18px",
              marginBottom: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Legal Name or Legal Business Name *
              </label>
              <input
                required
                value={form.legalName}
                onChange={updateField("legalName")}
                style={{
                  width: "100%",
                  padding: "10px 11px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Primary Contact Name *
              </label>
              <input
                required
                value={form.contactName}
                onChange={updateField("contactName")}
                style={{
                  width: "100%",
                  padding: "10px 11px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* ROLE + MC + EIN */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr 1fr",
              gap: "14px 18px",
              marginBottom: "14px",
            }}
          >
            {/* ROLE – RADIO BUTTONS */}
            <div>
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Role *
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  fontSize: "14px",
                }}
              >
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Broker"
                    checked={form.role === "Broker"}
                    onChange={updateField("role")}
                    style={{ marginRight: "6px" }}
                  />
                  Broker
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Shipper"
                    checked={form.role === "Shipper"}
                    onChange={updateField("role")}
                    style={{ marginRight: "6px" }}
                  />
                  Shipper
                </label>
              </div>
            </div>

            {/* MC NUMBER */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                MC Number *
              </label>
              <input
                required
                value={form.mcNumber}
                onChange={updateField("mcNumber")}
                placeholder="MC 000000"
                style={{
                  width: "100%",
                  padding: "10px 11px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>

            {/* EIN OPTIONAL */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                EIN (optional)
              </label>
              <input
                value={form.ein}
                onChange={updateField("ein")}
                style={{
                  width: "100%",
                  padding: "10px 11px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* PHONE + EMAIL */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 18px",
              marginBottom: "18px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Business Phone *
              </label>
              <input
                required
                value={form.phone}
                onChange={updateField("phone")}
                placeholder="123-456-7890"
                style={{
                  width: "100%",
                  padding: "10px 11px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Business Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={updateField("email")}
                style={{
                  width: "100%",
                  padding: "10px 11px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            style={{
              padding: "14px 28px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 600,
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            }}
          >
            Submit Request
          </button>

          {/* STATUS MESSAGE */}
          {status === "success" && (
            <div
              style={{
                marginTop: "14px",
                fontSize: "13px",
                padding: "10px 12px",
                borderRadius: "10px",
                background: "rgba(22,163,74,0.18)",
                border: "1px solid rgba(74,222,128,0.8)",
              }}
            >
              Request received (demo). In production this form would create an
              access request record and notify QueCab AdbS support or your
              account admin.
            </div>
          )}
        </form>

        {/* FOOTER NOTE */}
        {status !== "success" && (
          <div
            style={{
              marginTop: "16px",
              fontSize: "12px",
              opacity: 0.8,
            }}
          >
            Demo only – in production this form would create an access request
            record and notify QueCab AdbS support or your account admin.
          </div>
        )}
      </div>
    </div>
  );
}
