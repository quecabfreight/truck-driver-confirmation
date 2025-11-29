import React, { useState } from "react";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;

  if (len <= 3) return digits;
  if (len <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ControlCenter() {
  const [form, setForm] = useState({
    loadRef: "",
    carrierName: "",
    usdot: "",
    plate: "",
    driverName: "",
    driverPhone: "",
    sendEmail: true,
    sendText: false,
    targetEmail: "",
    windowStart: "",
    windowEnd: "",
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;

    let nextValue = type === "checkbox" ? checked : value;

    // Auto-uppercase USDOT and plate (any alpha characters)
    if (name === "usdot" || name === "plate") {
      nextValue = nextValue.toUpperCase();
    }

    // Auto-format phone as 123-456-7890
    if (name === "driverPhone") {
      nextValue = formatPhone(nextValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.loadRef ||
      !form.carrierName ||
      !form.usdot ||
      !form.plate ||
      !form.driverPhone
    ) {
      setStatus({
        type: "error",
        message:
          "For this demo, enter at least Load Reference, Carrier name, USDOT#, Plate, and Driver phone.",
      });
      return;
    }

    if (!form.sendEmail && !form.sendText) {
      setStatus({
        type: "error",
        message: "Choose at least one send method: email, text, or both.",
      });
      return;
    }

    if (form.sendEmail && !form.targetEmail) {
      setStatus({
        type: "error",
        message:
          "Add the email address where this AdbS Truck-Driver Verify Link should be sent.",
      });
      return;
    }

    setStatus({
      type: "success",
      message:
        "Demo only. In the live system this will generate a unique AdbS Truck-Driver Verify Link for this load and deliver it by the methods you chose.",
    });
  }

  return (
    <div className="qc-shell qc-dashboard-shell">
      <div className="qc-inner qc-dashboard-inner">
        {/* Header */}
        <div className="qc-dash-header">
          <h1 className="qc-heading">AdbS Control Center</h1>
          <p className="qc-sub">
            For licensed brokers and shippers to issue AdbS Truck-Driver Verify
            Links, monitor active loads, and review recent dock-side checks.
            This build is a visual demo – live wiring comes next.
          </p>
        </div>

        <div className="qc-dash-grid">
          {/* LEFT – Issue link form */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Issue AdbS Verification Link</h2>
            <p className="qc-dash-text">
              Define a specific load and Truck-Driver unit. AdbS will generate a
              verification link that your dock team uses to confirm the USDOT#
              and plate against your record before loading.
            </p>

            <form className="qc-form" onSubmit={handleSubmit}>
              <div className="qc-form-grid">
                {/* Load reference */}
                <div className="qc-field">
                  <label className="qc-label">
                    Load Reference<span className="qc-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="loadRef"
                    className="qc-input"
                    value={form.loadRef}
                    onChange={handleChange}
                    placeholder="PO#, load ID, or internal reference"
                  />
                </div>

                {/* Carrier / legal name */}
                <div className="qc-field">
                  <label className="qc-label">
                    Carrier / Legal Name<span className="qc-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="carrierName"
                    className="qc-input"
                    value={form.carrierName}
                    onChange={handleChange}
                    placeholder="Exact name on FMCSA / paperwork"
                  />
                </div>

                {/* USDOT */}
                <div className="qc-field">
                  <label className="qc-label">
                    USDOT# on Truck<span className="qc-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="usdot"
                    className="qc-input"
                    value={form.usdot}
                    onChange={handleChange}
                    placeholder="Digits or alphanumerics as shown on truck"
                  />
                </div>

                {/* Plate */}
                <div className="qc-field">
                  <label className="qc-label">
                    License Plate<span className="qc-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="plate"
                    className="qc-input"
                    value={form.plate}
                    onChange={handleChange}
                    placeholder="Plate text as expected on the truck"
                  />
                </div>

                {/* Driver name (optional) */}
                <div className="qc-field">
                  <label className="qc-label">Driver Name (optional)</label>
                  <input
                    type="text"
                    name="driverName"
                    className="qc-input"
                    value={form.driverName}
                    onChange={handleChange}
                    placeholder="For your internal notes"
                  />
                </div>

                {/* Driver phone */}
                <div className="qc-field">
                  <label className="qc-label">
                    Driver Phone<span className="qc-required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="driverPhone"
                    className="qc-input"
                    value={form.driverPhone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                  />
                </div>

                {/* Send via */}
                <div className="qc-field">
                  <label className="qc-label">Send Link Via</label>
                  <div className="qc-radio-row">
                    <label className="qc-radio">
                      <input
                        type="checkbox"
                        name="sendEmail"
                        checked={form.sendEmail}
                        onChange={handleChange}
                      />
                      <span>Email</span>
                    </label>
                    <label className="qc-radio">
                      <input
                        type="checkbox"
                        name="sendText"
                        checked={form.sendText}
                        onChange={handleChange}
                      />
                      <span>Text</span>
                    </label>
                  </div>
                </div>

                {/* Send-to email */}
                <div className="qc-field">
                  <label className="qc-label">
                    Send To Email
                    {form.sendEmail && <span className="qc-required">*</span>}
                  </label>
                  <input
                    type="email"
                    name="targetEmail"
                    className="qc-input"
                    value={form.targetEmail}
                    onChange={handleChange}
                    placeholder="Dock or dispatcher email for this load"
                  />
                </div>

                {/* Validity window – start */}
                <div className="qc-field">
                  <label className="qc-label">Link Start (optional)</label>
                  <input
                    type="datetime-local"
                    name="windowStart"
                    className="qc-input"
                    value={form.windowStart}
                    onChange={handleChange}
                  />
                </div>

                {/* Validity window – end */}
                <div className="qc-field">
                  <label className="qc-label">Link Expires (optional)</label>
                  <input
                    type="datetime-local"
                    name="windowEnd"
                    className="qc-input"
                    value={form.windowEnd}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {status && (
                <div
                  className={
                    status.type === "success"
                      ? "qc-status qc-status-success"
                      : "qc-status qc-status-error"
                  }
                >
                  {status.message}
                </div>
              )}

              <div className="qc-form-actions">
                <button type="submit" className="qc-btn-primary qc-btn-wide">
                  Issue Verification Link (Demo)
                </button>
              </div>
            </form>
          </section>

          {/* MIDDLE – Active links */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Active Verify Links</h2>
            <p className="qc-dash-text">
              In the full system, this will show AdbS Truck-Driver Verify Links
              that are currently valid and waiting to be used at the dock.
            </p>

            <div className="qc-dash-empty">
              No active links in this demo. Once live, each entry will show load
              reference, carrier, link status, and last activity.
            </div>
          </section>

          {/* RIGHT – Recent checks */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Recent Truck-Driver Checks</h2>
            <p className="qc-dash-text">
              This panel will list recent dock-side verifications, including
              whether the USDOT# and plate matched and if the driver answered
              their registered phone.
            </p>

            <div className="qc-dash-empty">
              No recent checks in this demo. When wired, this becomes your
              at-a-glance history of Truck-Driver confirmations.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
