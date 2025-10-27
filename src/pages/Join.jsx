import { useState } from "react";
import "./verify.css";

export default function Join() {
  // form state
  const [legalName, setLegalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("broker"); // "broker" or "shipper"
  const [mcNumber, setMcNumber] = useState("");
  const [ein, setEin] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [notes, setNotes] = useState("");

  // basic submit handler (placeholder)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Build payload
    const payload = {
      legalName,
      contactName,
      role,
      mcNumber: role === "broker" ? mcNumber.trim() : "",
      ein: role === "broker" ? ein.trim() : "",
      businessPhone,
      businessEmail,
      notes,
    };

    // 🔒 FUTURE:
    // 1. Run MC / DOT / EIN verification against FMCSA data.
    // 2. If match === good, auto-mark "pre-verified".
    // 3. If mismatch or no record, mark "pending manual review".
    //
    // For now, we would POST this to our API route or serverless function.
    // Example:
    // fetch("/api/onboard", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // })

    console.log("Submitted onboarding payload:", payload);

    alert(
      "Request received. Once approved, you'll get your QueCab AdbS authorization code."
    );

    // reset (optional)
    setLegalName("");
    setContactName("");
    setRole("broker");
    setMcNumber("");
    setEin("");
    setBusinessPhone("");
    setBusinessEmail("");
    setNotes("");
  };

  return (
    <div
      className="verify-wrap"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* simple header strip */}
      <header
        className="verify-header"
        style={{
          borderBottom: "1px solid var(--ring)",
          background:
            "linear-gradient(180deg,#0f1014 0%,#0a0b0d 60%,rgba(0,0,0,0) 100%)",
          boxShadow:
            "0 30px 60px rgba(0,0,0,.9), 0 0 40px rgba(255,255,255,.06) inset",
          padding: "16px 20px",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: ".3px",
          textTransform: "uppercase",
        }}
      >
        <div style={{ color: "var(--text)" }}>QueCab AdbS</div>
        <div
          style={{
            color: "var(--muted)",
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: ".4px",
          }}
        >
          Request Access
        </div>
      </header>

      <main
        className="verify-main"
        style={{
          maxWidth: "860px",
          width: "100%",
          margin: "24px auto 40px",
          padding: "0 16px 80px",
        }}
      >
        <section
          style={{
            background: "var(--card)",
            border: "1px solid var(--ring)",
            borderRadius: "18px",
            boxShadow: "0 30px 80px rgba(0,0,0,.9)",
            padding: "20px 20px 24px",
            maxWidth: "520px",
            margin: "0 auto",
          }}
        >
          {/* Section heading */}
          <div
            style={{
              marginBottom: "20px",
              lineHeight: 1.3,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "20px",
                color: "var(--text)",
                marginBottom: "6px",
              }}
            >
              Join QueCab AdbS
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "var(--muted)",
                lineHeight: 1.4,
              }}
            >
              Brokers and shippers only. After review, approved accounts receive
              an authorization code to verify carriers at the dock.
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              rowGap: "16px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            {/* LEGAL NAME */}
            <div style={{ display: "grid", rowGap: "6px" }}>
              <label htmlFor="legalName" style={{ fontWeight: 600 }}>
                Legal Name (or Legal Business Name)
              </label>
              <input
                id="legalName"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Example: Power Logistics LLC / or John R. Carter"
                style={inputStyle}
              />
            </div>

            {/* CONTACT PERSON */}
            <div style={{ display: "grid", rowGap: "6px" }}>
              <label htmlFor="contactName" style={{ fontWeight: 600 }}>
                Contact Person Name
              </label>
              <input
                id="contactName"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Dispatcher / Compliance / Shipping Manager"
                style={inputStyle}
              />
            </div>

            {/* ROLE SELECTION */}
            <div style={{ display: "grid", rowGap: "6px" }}>
              <div style={{ fontWeight: 600 }}>Your Role</div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  fontSize: "13px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="broker"
                    checked={role === "broker"}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ cursor: "pointer" }}
                  />
                  <span>Broker</span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="shipper"
                    checked={role === "shipper"}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ cursor: "pointer" }}
                  />
                  <span>Shipper</span>
                </label>
              </div>

              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: "var(--muted)",
                }}
              >
                Broker = you arrange loads / dispatch carriers. Shipper = you
                own the freight.
              </div>
            </div>

            {/* MC NUMBER (BROKER ONLY) */}
            {role === "broker" && (
              <div style={{ display: "grid", rowGap: "6px" }}>
                <label htmlFor="mcNumber" style={{ fontWeight: 600 }}>
                  MC Number (required for brokers)
                </label>
                <input
                  id="mcNumber"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={mcNumber}
                  onChange={(e) => setMcNumber(e.target.value)}
                  placeholder="Enter MC Number (digits only)"
                  style={inputStyle}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "var(--muted)",
                  }}
                >
                  We use this to confirm your legal broker authority and stop
                  carrier impersonation. Do not include the letters “MC” — just
                  the number.
                </div>
              </div>
            )}

            {/* EIN (BROKER PROMPTED) */}
            {role === "broker" && (
              <div style={{ display: "grid", rowGap: "6px" }}>
                <label htmlFor="ein" style={{ fontWeight: 600 }}>
                  EIN (Tax ID)
                  <span
                    style={{
                      fontWeight: 400,
                      color: "var(--muted)",
                      marginLeft: "6px",
                      fontSize: "11px",
                    }}
                  >
                    optional, but recommended
                  </span>
                </label>
                <input
                  id="ein"
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  placeholder="##-#######"
                  style={inputStyle}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "var(--muted)",
                  }}
                >
                  Helps us confirm you’re a real registered brokerage and not a
                  spoof account.
                </div>
              </div>
            )}

            {/* BUSINESS PHONE */}
            <div style={{ display: "grid", rowGap: "6px" }}>
              <label htmlFor="businessPhone" style={{ fontWeight: 600 }}>
                Business Phone
              </label>
              <input
                id="businessPhone"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="555-123-4567"
                style={inputStyle}
              />
            </div>

            {/* BUSINESS EMAIL */}
            <div style={{ display: "grid", rowGap: "6px" }}>
              <label htmlFor="businessEmail" style={{ fontWeight: 600 }}>
                Business Email
              </label>
              <input
                id="businessEmail"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="dispatch@yourcompany.com"
                style={inputStyle}
              />
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: "var(--muted)",
                }}
              >
                  We prefer company email. Free email (gmail, yahoo, etc.) may
                  delay approval unless you’re a small direct shipper.
              </div>
            </div>

            {/* NOTES / EXTRA CONTEXT */}
            <div style={{ display: "grid", rowGap: "6px" }}>
              <label htmlFor="notes" style={{ fontWeight: 600 }}>
                Anything we should know?
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: We only ship steel coils in the Midwest. Night shift 5pm–5am needs access."
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "70px",
                }}
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              style={{
                marginTop: "8px",
                width: "100%",
                height: "46px",
                borderRadius: "12px",
                border: "1px solid #2e3240",
                background: "#0f1117",
                fontWeight: 700,
                color: "#eaecef",
                letterSpacing: ".5px",
                cursor: "pointer",
              }}
            >
              Submit Request
            </button>

            {/* EXPLAINER AFTER SUBMIT */}
            <div
              style={{
                fontSize: "11px",
                fontWeight: 400,
                color: "var(--muted)",
                lineHeight: 1.4,
                textAlign: "center",
              }}
            >
              After approval, you’ll receive a QueCab AdbS code. That code lets
              you verify carriers at the dock and flag mismatches in real time.
            </div>
          </form>
        </section>
      </main>

      {/* small footer */}
      <footer
        style={{
          width: "100%",
          textAlign: "center",
          fontSize: "11px",
          lineHeight: 1.4,
          color: "var(--muted)",
          padding: "20px 16px 32px",
          borderTop: "1px solid var(--ring)",
          background:
            "linear-gradient(180deg,#0d0e12 0%,rgba(0,0,0,0) 60%)",
          boxShadow:
            "0 -20px 60px rgba(0,0,0,.9), 0 0 80px rgba(180,200,255,.15)",
        }}
      >
        Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab
        Inc.
      </footer>
    </div>
  );
}

// shared input field styling
const inputStyle = {
  width: "100%",
  background: "#12131a",
  color: "#e6e8ec",
  border: "1px solid #2a2e3a",
  borderRadius: "10px",
  padding: "10px 12px",
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: 1.4,
  outline: "none",
};
