import { useState, useMemo } from "react";
import "./verify.css"; // reuse dark theme styles for now

export default function Join() {
  // form state
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("broker"); // "broker" | "shipper"
  const [mcNumber, setMcNumber] = useState("");
  const [usdotNumber, setUsdotNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [scac, setScac] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);

  // detect public email domain
  const emailDomainFlag = useMemo(() => {
    if (!email.includes("@")) return false;
    const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "proton.me", "protonmail.com"];
    const domain = email.split("@").pop().toLowerCase().trim();
    return publicDomains.includes(domain);
  }, [email]);

  function handleSubmit(e) {
    e.preventDefault();

    // build the application record
    const application = {
        ts: new Date().toISOString(),
        company,
        contactName,
        role,
        mcNumber: role === "broker" ? mcNumber : "",
        usdotNumber: role === "shipper" ? usdotNumber : "",
        phone,
        email,
        scac,
        notes,
        status: "pending-review",
    };

    // store locally for now so you can inspect it in DevTools
    try {
      const existing = JSON.parse(localStorage.getItem("qc_join_requests") || "[]");
      existing.push(application);
      localStorage.setItem("qc_join_requests", JSON.stringify(existing));
      console.log("QueCab AdbS application logged:", application);
    } catch (err) {
      console.error("Could not save application:", err);
    }

    setSubmitted(true);
  }

  // after submit, show thank-you screen
  if (submitted) {
    return (
      <div className="verify-wrap" style={{ minHeight: "100vh" }}>
        <header className="verify-header">
          <div className="brand">QueCab <span className="sub">AdbS</span></div>
        </header>

        <main className="verify-main">
          <div className="result clear" style={{ marginTop: "24px" }}>
            <div className="title" style={{ fontSize: "22px" }}>Request Received</div>
            <div className="desc">
              Thank you, {contactName || "applicant"}.
              <br />
              Your access request has been submitted for manual review.
              <br />
              Once verified, you'll receive your QueCab AdbS authorization code.
            </div>
          </div>

          <div className="verify-footer-link" style={{ justifyContent: "flex-start" }}>
            <a className="footer-cta" href="/login">Already have a code? Log in</a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="verify-wrap" style={{ minHeight: "100vh" }}>
      <header className="verify-header">
        <div className="brand">QueCab <span className="sub">AdbS</span></div>
      </header>

      <main className="verify-main">
        {/* Title card */}
        <div
          className="dot-box"
          style={{ marginBottom: "24px" }}
        >
          <div className="dot-label" style={{ fontSize: "14px", color: "var(--muted)" }}>
            Request Access
          </div>
          <div className="dot-value" style={{ fontSize: "28px", lineHeight: 1.2 }}>
            Join QueCab AdbS
          </div>
          <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "8px", fontWeight: 500 }}>
            Brokers and shippers only.
            After review, approved accounts receive an authorization code to verify carriers at the dock.
          </div>
        </div>

        {/* Form card */}
        <form className="driver-card" onSubmit={handleSubmit}>
          {/* Company / individual name */}
          <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
              Legal Company Name (or Your Name)
            </label>
            <input
              className="input"
              required
              placeholder="Example: Power Logistics LLC"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>

          {/* Contact name */}
          <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
              Contact Person Name
            </label>
            <input
              className="input"
              required
              placeholder="Dispatcher / Compliance / Shipping Manager"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
              Your Role
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="role"
                  value="broker"
                  checked={role === "broker"}
                  onChange={() => setRole("broker")}
                />
                Broker
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="role"
                  value="shipper"
                  checked={role === "shipper"}
                  onChange={() => setRole("shipper")}
                />
                Shipper
              </label>
            </div>

            <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4, marginTop: "6px" }}>
              Broker = you arrange loads / dispatch carriers. Shipper = you own the freight.
            </div>
          </div>

          {/* MC for brokers */}
          {role === "broker" && (
            <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
                MC Number (required for brokers)
              </label>
              <input
                className="input"
                required={role === "broker"}
                placeholder="MC 123456"
                value={mcNumber}
                onChange={e => setMcNumber(e.target.value)}
              />
              <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4, marginTop: "6px" }}>
                We use this to confirm your legal authority and stop carrier impersonation.
              </div>
            </div>
          )}

          {/* USDOT for shippers / carriers */}
          {role === "shipper" && (
            <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
                USDOT Number (if available)
              </label>
              <input
                className="input"
                required={false}
                placeholder="1234567"
                value={usdotNumber}
                onChange={e => setUsdotNumber(e.target.value)}
              />
              <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4, marginTop: "6px" }}>
                If you run trucks under your own authority, enter that USDOT #. If not, leave blank.
              </div>
            </div>
          )}

          {/* Phone */}
          <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
              Business Phone
            </label>
            <input
              className="input"
              required
              placeholder="555-123-4567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
              Business Email
            </label>
            <input
              className="input"
              required
              type="email"
              placeholder="dispatch@yourcompany.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {email && emailDomainFlag && (
              <div style={{ fontSize: "12px", color: "var(--accent)", lineHeight: 1.4, marginTop: "6px" }}>
                Public email domain detected (gmail / yahoo / outlook).
                This will require manual review before approval.
              </div>
            )}
          </div>

          {/* SCAC */}
          <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
              SCAC (optional)
            </label>
            <input
              className="input"
              placeholder="ABCD"
              value={scac}
              onChange={e => setScac(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4, marginTop: "6px" }}>
              If you have an assigned SCAC, enter it. If not, leave blank.
            </div>
          </div>

          {/* Notes */}
          <div className="driver-line" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <label className="muted" style={{ fontSize: "13px", fontWeight: 600 }}>
              Notes / Comments (optional)
            </label>
            <textarea
              className="input"
              style={{ minHeight: "70px", resize: "vertical" }}
              placeholder="Anything we should know? Typical lanes, concerns, fraud incidents, etc."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button className="submit" style={{ marginTop: "12px" }}>
            Request Access
          </button>

          <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4, marginTop: "10px" }}>
            Submitting this form does NOT instantly activate you.
            QueCab AdbS will review your request. Approved users receive a secure authorization code.
          </div>
        </form>

        {/* footer link */}
        <div className="verify-footer-link" style={{ justifyContent: "flex-start" }}>
          <a className="footer-cta" href="/login">Already have a code? Log in</a>
        </div>
      </main>
    </div>
  );
}
