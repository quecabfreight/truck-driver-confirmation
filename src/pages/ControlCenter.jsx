import React, { useState, useEffect } from "react";
import {
  issueVerificationLink,
  getActiveLinks,
  getRecentChecks,
} from "../utils/demoApi.js";

export default function ControlCenter() {
  const [form, setForm] = useState({
    loadReference: "",
    carrierName: "",
    usdotOnRecord: "",
    plateOnRecord: "",
    driverName: "",
    driverPhone: "",
    sendViaEmail: true,
    sendViaText: false,
    sendToEmail: "",
    linkStart: "",
    linkExpire: "",
  });

  const [activeLinks, setActiveLinks] = useState([]);
  const [recentChecks, setRecentChecksState] = useState([]);
  const [demoMessage, setDemoMessage] = useState("");

  useEffect(() => {
    refreshPanels();
  }, []);

  function refreshPanels() {
    setActiveLinks(getActiveLinks());
    setRecentChecksState(getRecentChecks(10));
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    let next = value;

    if (name === "usdotOnRecord" || name === "plateOnRecord") {
      next = next.toUpperCase();
    }
    if (name === "driverPhone") {
      // Auto-format 123-456-7890
      const digits = next.replace(/\D/g, "").slice(0, 10);
      if (digits.length >= 7) {
        next = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
          6
        )}`;
      } else if (digits.length >= 4) {
        next = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        next = digits;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: next,
    }));
  }

  function handleIssueLink(e) {
    e.preventDefault();

    if (!form.loadReference || !form.carrierName) {
      setDemoMessage("Enter a load reference and carrier / legal name.");
      return;
    }
    if (!form.usdotOnRecord || !form.plateOnRecord) {
      setDemoMessage("Enter the USDOT# and plate on your record for this load.");
      return;
    }
    if (!form.sendToEmail) {
      setDemoMessage("Enter the email address to send this link to.");
      return;
    }

    const { token, verifyUrl } = issueVerificationLink(form);

    setDemoMessage(
      `Demo only. This would generate a unique AdbS Truck-Driver Verify Link for this load and deliver it by the methods you chose.\n\nToken: ${token}\nLink: ${verifyUrl}\n\nThe link is now shown in Active Verify Links.`
    );

    // reset only a few fields
    setForm((prev) => ({
      ...prev,
      loadReference: "",
      carrierName: "",
      usdotOnRecord: "",
      plateOnRecord: "",
      driverName: "",
      driverPhone: "",
    }));

    refreshPanels();
  }

  return (
    <div className="qc-shell qc-dash">
      <div className="qc-inner">
        <header className="qc-dash-header">
          <h1 className="qc-heading">AdbS Control Center</h1>
          <p className="qc-sub">
            For licensed brokers and shippers to issue AdbS Truck-Driver Verify
            Links, monitor active loads, and review recent dock-side checks.
            This build is a visual demo – live wiring now comes next.
          </p>
        </header>

        <div className="qc-dash-grid qc-dash-grid-3">
          {/* LEFT – ISSUE LINK */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Issue AdbS Verification Link</h2>
            <p className="qc-dash-text">
              Define a specific load and Truck-Driver unit. AdbS will generate a
              verification link that your dock team uses to confirm the USDOT#
              and plate against your record before loading.
            </p>

            <form className="qc-form" onSubmit={handleIssueLink}>
              <div className="qc-form-grid-two">
                <div className="qc-field">
                  <label className="qc-label">
                    Load Reference <span className="qc-required">*</span>
                  </label>
                  <input
                    className="qc-input"
                    name="loadReference"
                    value={form.loadReference}
                    onChange={handleChange}
                    placeholder="PO#, load ID, or internal ref"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">
                    Carrier / Legal Name <span className="qc-required">*</span>
                  </label>
                  <input
                    className="qc-input"
                    name="carrierName"
                    value={form.carrierName}
                    onChange={handleChange}
                    placeholder="ABC Trucking"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">
                    USDOT# on Truck <span className="qc-required">*</span>
                  </label>
                  <input
                    className="qc-input"
                    name="usdotOnRecord"
                    value={form.usdotOnRecord}
                    onChange={handleChange}
                    placeholder="Uppercase or numbers as in FMCSA page"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">
                    License Plate <span className="qc-required">*</span>
                  </label>
                  <input
                    className="qc-input"
                    name="plateOnRecord"
                    value={form.plateOnRecord}
                    onChange={handleChange}
                    placeholder="Plate as on paperwork"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">Driver Name (optional)</label>
                  <input
                    className="qc-input"
                    name="driverName"
                    value={form.driverName}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">
                    Driver Phone <span className="qc-required">*</span>
                  </label>
                  <input
                    className="qc-input"
                    name="driverPhone"
                    value={form.driverPhone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                  />
                </div>

                <div className="qc-field qc-field-inline">
                  <label className="qc-label">Send Link Via</label>
                  <label className="qc-check-inline">
                    <input
                      type="checkbox"
                      name="sendViaEmail"
                      checked={form.sendViaEmail}
                      onChange={handleChange}
                    />
                    <span>Email</span>
                  </label>
                  <label className="qc-check-inline">
                    <input
                      type="checkbox"
                      name="sendViaText"
                      checked={form.sendViaText}
                      onChange={handleChange}
                    />
                    <span>Text</span>
                  </label>
                </div>

                <div className="qc-field">
                  <label className="qc-label">
                    Send To Email <span className="qc-required">*</span>
                  </label>
                  <input
                    className="qc-input"
                    name="sendToEmail"
                    type="email"
                    value={form.sendToEmail}
                    onChange={handleChange}
                    placeholder="docs or dispatcher email"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">Link Start (optional)</label>
                  <input
                    className="qc-input"
                    type="date"
                    name="linkStart"
                    value={form.linkStart}
                    onChange={handleChange}
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">Link Expires (optional)</label>
                  <input
                    className="qc-input"
                    type="date"
                    name="linkExpire"
                    value={form.linkExpire}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {demoMessage && (
                <div className="qc-status qc-status-demo">
                  {demoMessage.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              <div className="qc-form-actions">
                <button type="submit" className="qc-btn-primary qc-btn-wide">
                  Issue Verification Link (Demo)
                </button>
              </div>
            </form>
          </section>

          {/* MIDDLE – ACTIVE LINKS */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Active Verify Links</h2>
            <p className="qc-dash-text">
              In the full system, this will show AdbS Truck-Driver Verify Links
              that are currently valid and waiting to be used at the dock.
            </p>

            {activeLinks.length === 0 ? (
              <p className="qc-dash-empty">No active links in this demo.</p>
            ) : (
              <ul className="qc-list-compact">
                {activeLinks.map((link) => (
                  <li key={link.token} className="qc-list-item">
                    <div className="qc-list-main">
                      <div className="qc-list-line-strong">
                        {link.loadReference} — {link.carrierName}
                      </div>
                      <div className="qc-list-line">
                        USDOT#: {link.usdotOnRecord} · Plate:{" "}
                        {link.plateOnRecord}
                      </div>
                      <div className="qc-list-line qc-mono">
                        Link:{" "}
                        {window.location.origin + "/#/verify/" + link.token}
                      </div>
                    </div>
                    <div className="qc-list-tag qc-list-tag-demo">
                      {link.status === "pending"
                        ? "Pending"
                        : link.status === "cleared"
                        ? "Cleared"
                        : "Caution"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* RIGHT – RECENT CHECKS */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Recent Truck-Driver Checks</h2>
            <p className="qc-dash-text">
              This panel will list recent dock-side verifications, including
              whether the USDOT# and plate matched and if the driver answered
              their phone.
            </p>

            {recentChecks.length === 0 ? (
              <p className="qc-dash-empty">No recent checks in this demo.</p>
            ) : (
              <ul className="qc-list-compact">
                {recentChecks.map((c) => (
                  <li key={c.id} className="qc-list-item">
                    <div className="qc-list-main">
                      <div className="qc-list-line-strong">
                        {c.loadReference} — {c.carrierName}
                      </div>
                      <div className="qc-list-line">
                        USDOT: {c.usdotEntered} · Plate: {c.plateEntered}
                      </div>
                      <div className="qc-list-line">
                        Result:{" "}
                        {c.result === "cleared"
                          ? "CLEAR TO LOAD"
                          : "CAUTION ALERT – DO NOT LOAD"}
                      </div>
                    </div>
                    <div
                      className={
                        c.result === "cleared"
                          ? "qc-list-tag qc-list-tag-success"
                          : "qc-list-tag qc-list-tag-caution"
                      }
                    >
                      {new Date(c.checkedAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
