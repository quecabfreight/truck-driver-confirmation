// src/pages/VerifyDriver.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";

function formatUpper(value) {
  return value.toUpperCase();
}

export default function VerifyDriver() {
  const { token } = useParams();

  // Demo-only record info (real data will come from backend later)
  const demoRecord = {
    loadId: "12345",
    carrier: "ABC Trucking",
    usdot: "ABC12345",
    plate: "ABC12345",
    phone: "123-456-7890",
  };

  const [pinInput, setPinInput] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);

  const [form, setForm] = useState({
    usdotOnTruck: "",
    plateOnTruck: "",
    driverAnswered: "",
  });

  const [status, setStatus] = useState(null);

  function handleUnlock(e) {
    e.preventDefault();

    // DEMO-ONLY PIN. In the live system this will be per dock / facility.
    if (pinInput.trim() === "1234") {
      setPinUnlocked(true);
      setStatus(null);
    } else {
      setStatus({
        type: "error",
        message: "Invalid dock PIN in this demo. Try 1234.",
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === "usdotOnTruck" || name === "plateOnTruck") {
      nextValue = formatUpper(nextValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.usdotOnTruck || !form.plateOnTruck) {
      setStatus({
        type: "error",
        message:
          "Enter the USDOT# and license plate exactly as seen on the truck.",
      });
      return;
    }

    if (!form.driverAnswered) {
      setStatus({
        type: "error",
        message:
          "Answer the question: Did the driver answer their registered phone?",
      });
      return;
    }

    // For now, demo treats "driver answered = YES" as the final check.
    const clearToLoad = form.driverAnswered === "yes";

    if (clearToLoad) {
      setStatus({
        type: "success",
        message:
          "CLEAR TO LOAD – USDOT# and plate match your record, and the driver answered their registered phone.",
      });
    } else {
      setStatus({
        type: "caution",
        message:
          "CAUTION ALERT – DO NOT LOAD. At least one check failed. Hold this load and follow your internal escalation steps.",
      });
    }
  }

  const telHref = `tel:${demoRecord.phone.replace(/[^0-9]/g, "")}`;

  return (
    <div className="qc-shell qc-dash">
      <div className="qc-inner">
        <header className="qc-dash-header">
          <h1 className="qc-heading">Truck-Driver Verification</h1>
          <p className="qc-sub">
            For authorized dock and check-in personnel only. Confirm the
            Truck-Driver unit (truck + driver) in real time before you open a
            door or touch a pallet.
          </p>

          <p className="qc-note qc-mono">
            <strong>Load:</strong> <span>{demoRecord.loadId}</span>
          </p>
          <p className="qc-note qc-mono">
            <strong>Carrier:</strong> <span>{demoRecord.carrier}</span>
          </p>
          <p className="qc-note qc-mono">
            <strong>On record (USDOT / Plate):</strong>{" "}
            <span>
              {demoRecord.usdot} / {demoRecord.plate}
            </span>
          </p>
          <p className="qc-note qc-mono">
            Demo token: <span>{token || "N/A"}</span>
          </p>
        </header>

        <div className="qc-dash-grid qc-dash-grid-2">
          {/* LEFT – PIN + verification form */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Dock Access PIN</h2>
            <p className="qc-dash-text">
              In the live system, every dock or check-in station will have its
              own PIN. Drivers never see this screen.
            </p>

            {!pinUnlocked && (
              <form className="qc-form" onSubmit={handleUnlock}>
                <div className="qc-field qc-field-row">
                  <label className="qc-label">Enter Dock PIN</label>
                  <input
                    type="password"
                    className="qc-input qc-input-pin"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••"
                  />
                  <button type="submit" className="qc-btn-primary">
                    Unlock
                  </button>
                </div>
              </form>
            )}

            {pinUnlocked && (
              <>
                <div className="qc-divider" />

                <h2 className="qc-dash-title">Verify the Truck-Driver</h2>
                <p className="qc-dash-text">
                  Enter what you see on the truck for USDOT# and plate, use the{" "}
                  <strong>Call Driver</strong> button to reach the registered
                  phone, then set the YES/NO answer below. All three checks must
                  be <strong>YES</strong> to clear the load.
                </p>

                <form className="qc-form" onSubmit={handleSubmit}>
                  <div className="qc-form-grid-single">
                    <div className="qc-field">
                      <label className="qc-label">
                        USDOT# on Truck <span className="qc-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="usdotOnTruck"
                        className="qc-input"
                        value={form.usdotOnTruck}
                        onChange={handleChange}
                        placeholder="As painted on the truck door"
                      />
                    </div>

                    <div className="qc-field">
                      <label className="qc-label">
                        License Plate on Truck{" "}
                        <span className="qc-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="plateOnTruck"
                        className="qc-input"
                        value={form.plateOnTruck}
                        onChange={handleChange}
                        placeholder="Exact plate text"
                      />
                    </div>

                    <div className="qc-field">
                      <label className="qc-label">
                        DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
                      </label>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            window.location.href = telHref;
                          }}
                          className="qc-btn-primary"
                          style={{
                            padding: "0.5rem 1.25rem",
                            borderRadius: "999px",
                            fontWeight: 600,
                            background:
                              "linear-gradient(90deg, #1b6fff, #36d1ff)",
                            border: "none",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Call Driver {demoRecord.phone}
                        </button>

                        <div className="qc-radio-row">
                          <label className="qc-radio">
                            <input
                              type="radio"
                              name="driverAnswered"
                              value="yes"
                              checked={form.driverAnswered === "yes"}
                              onChange={handleChange}
                            />
                            <span>YES</span>
                          </label>
                          <label className="qc-radio">
                            <input
                              type="radio"
                              name="driverAnswered"
                              value="no"
                              checked={form.driverAnswered === "no"}
                              onChange={handleChange}
                            />
                            <span>NO</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {status && (
                    <div
                      className={
                        status.type === "success"
                          ? "qc-status qc-status-success"
                          : status.type === "caution"
                          ? "qc-status qc-status-caution"
                          : "qc-status qc-status-error"
                      }
                    >
                      {status.message}
                    </div>
                  )}

                  <div className="qc-form-actions">
                    <button
                      type="submit"
                      className="qc-btn-primary qc-btn-wide"
                    >
                      Submit Truck-Driver Check
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>

          {/* RIGHT – Dock checklist */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Dock Checklist</h2>
            <ol className="qc-list">
              <li>Ask the driver to remain in the cab or waiting area.</li>
              <li>
                Confirm you are on the correct AdbS verify screen for this load.
              </li>
              <li>
                Enter the <strong>USDOT#</strong> and{" "}
                <strong>license plate</strong> exactly as seen on the truck.
              </li>
              <li>
                Use the <strong>Call Driver</strong> button (or a desk phone) to
                call the driver’s registered number. If it doesn’t feel right,
                mark <strong>NO</strong>.
              </li>
              <li>
                Only when all three checks are <strong>YES</strong> is the load{" "}
                <strong>CLEAR TO LOAD</strong>.
              </li>
            </ol>

            <p className="qc-note">
              Demo only. In the live system, your answers here will feed back
              into the AdbS Control Center and the Truck-Driver checks panel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
