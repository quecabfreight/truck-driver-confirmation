import React, { useState } from "react";

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
    windowStart: "",
    windowEnd: "",
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // simple front-end validation for demo
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

    // Demo only — no real link issuance yet
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
                    placeholder="Digits only — as expected on the truck door"
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

                {/* Validity window */}
                <div className="qc-field">
                  <label className="qc-label">Link Start (optional)</label>
                  <input
                    type="text"
                    name="windowStart"
                    className="qc-input"
                    value={form.windowStart}
                    onChange={handleChange}
                    placeholder="e.g. 2025-11-30 08:00"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">Link Expires (optional)</label>
                  <input
                    type="text"
                    name="windowEnd"
                    className="qc-input"
                    value={form.windowEnd}
                    onChange={handleChange}
                    placeholder="e.g. 2025-12-01 23:59"
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
