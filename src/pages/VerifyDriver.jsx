import React, { useState } from "react";
import { useParams } from "react-router-dom";

function formatUpper(value) {
  return value.toUpperCase();
}

export default function VerifyDriver() {
  const { token } = useParams();

  const [pinInput, setPinInput] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);

  const [form, setForm] = useState({
    usdotOnTruck: "",
    plateOnTruck: "",
    usdotMatches: "",
    driverAnswered: "",
  });

  const [status, setStatus] = useState(null);

  // Bigger, dock-friendly text just for THIS page
  const styles = {
    heading: {
      fontSize: "2.6rem",
      letterSpacing: "0.04em",
    },
    sub: {
      fontSize: "1.15rem",
      maxWidth: "980px",
    },
    token: {
      fontFamily: "monospace",
      fontSize: "0.9rem",
      opacity: 0.85,
    },
    bigLabel: {
      fontSize: "1.2rem",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    input: {
      fontSize: "1.1rem",
      padding: "0.75rem 1rem",
    },
    radioQuestion: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    radioOption: {
      fontSize: "1.15rem",
      fontWeight: 600,
    },
    statusText: {
      fontSize: "1.2rem",
      lineHeight: 1.6,
    },
  };

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

    if (!form.usdotMatches || !form.driverAnswered) {
      setStatus({
        type: "error",
        message:
          "Answer both questions: Does the USDOT# match, and did the driver answer their registered phone?",
      });
      return;
    }

    const clearToLoad =
      form.usdotMatches === "yes" && form.driverAnswered === "yes";

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

  return (
    <div className="qc-shell qc-dash">
      <div className="qc-inner">
        <header className="qc-dash-header">
          <h1 className="qc-heading" style={styles.heading}>
            Truck-Driver Verification – DEMO
          </h1>
          <p className="qc-sub" style={styles.sub}>
            For authorized dock and check-in personnel only. Confirm the
            Truck-Driver unit (truck + driver) in real time before you open a
            door or touch a pallet.
          </p>
          <p className="qc-note qc-mono" style={styles.token}>
            Demo token: <span>{token || "N/A"}</span>
          </p>
        </header>

        <div className="qc-dash-grid qc-dash-grid-2">
          {/* LEFT – PIN + verification form */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Dock Access PIN</h2>
            <p className="qc-dash-text" style={{ fontSize: "1.05rem" }}>
              In the live system, every dock or check-in station will have its
              own PIN. Drivers never see this screen.
            </p>

            {!pinUnlocked && (
              <form className="qc-form" onSubmit={handleUnlock}>
                <div className="qc-field qc-field-row">
                  <label className="qc-label" style={styles.bigLabel}>
                    Enter Dock PIN
                  </label>
                  <input
                    type="password"
                    className="qc-input qc-input-pin"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••"
                    style={styles.input}
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
                <p className="qc-dash-text" style={{ fontSize: "1.05rem" }}>
                  Enter what you see on the truck, then answer the two checks
                  below. Both must be <strong>YES</strong> to clear the load.
                </p>

                <form className="qc-form" onSubmit={handleSubmit}>
                  <div className="qc-form-grid-single">
                    <div className="qc-field">
                      <label
                        className="qc-label"
                        style={styles.bigLabel}
                        htmlFor="usdotOnTruck"
                      >
                        USDOT# on Truck{" "}
                        <span className="qc-required">*</span>
                      </label>
                      <input
                        id="usdotOnTruck"
                        type="text"
                        name="usdotOnTruck"
                        className="qc-input"
                        value={form.usdotOnTruck}
                        onChange={handleChange}
                        placeholder="As painted on the truck door"
                        style={styles.input}
                      />
                    </div>

                    <div className="qc-field">
                      <label
                        className="qc-label"
                        style={styles.bigLabel}
                        htmlFor="plateOnTruck"
                      >
                        License Plate on Truck{" "}
                        <span className="qc-required">*</span>
                      </label>
                      <input
                        id="plateOnTruck"
                        type="text"
                        name="plateOnTruck"
                        className="qc-input"
                        value={form.plateOnTruck}
                        onChange={handleChange}
                        placeholder="Exact plate text"
                        style={styles.input}
                      />
                    </div>

                    <div className="qc-field">
                      <label
                        className="qc-label"
                        style={styles.radioQuestion}
                      >
                        DOES THE USDOT# ON THE TRUCK MATCH YOUR RECORD?
                      </label>
                      <div className="qc-radio-row">
                        <label className="qc-radio">
                          <input
                            type="radio"
                            name="usdotMatches"
                            value="yes"
                            checked={form.usdotMatches === "yes"}
                            onChange={handleChange}
                          />
                          <span style={styles.radioOption}>YES</span>
                        </label>
                        <label className="qc-radio">
                          <input
                            type="radio"
                            name="usdotMatches"
                            value="no"
                            checked={form.usdotMatches === "no"}
                            onChange={handleChange}
                          />
                          <span style={styles.radioOption}>NO</span>
                        </label>
                      </div>
                    </div>

                    <div className="qc-field">
                      <label
                        className="qc-label"
                        style={styles.radioQuestion}
                      >
                        DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
                      </label>
                      <div className="qc-radio-row">
                        <label className="qc-radio">
                          <input
                            type="radio"
                            name="driverAnswered"
                            value="yes"
                            checked={form.driverAnswered === "yes"}
                            onChange={handleChange}
                          />
                          <span style={styles.radioOption}>YES</span>
                        </label>
                        <label className="qc-radio">
                          <input
                            type="radio"
                            name="driverAnswered"
                            value="no"
                            checked={form.driverAnswered === "no"}
                            onChange={handleChange}
                          />
                          <span style={styles.radioOption}>NO</span>
                        </label>
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
                      <span style={styles.statusText}>{status.message}</span>
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

          {/* RIGHT – Instructions / checklist */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Dock Checklist</h2>
            <ol className="qc-list" style={{ fontSize: "1.05rem" }}>
              <li>Ask the driver to remain in the cab or waiting area.</li>
              <li>
                Confirm you are on the correct AdbS verify screen for this load.
              </li>
              <li>
                Enter the <strong>USDOT#</strong> and{" "}
                <strong>license plate</strong> exactly as seen on the truck.
              </li>
              <li>
                Call the driver’s registered phone. If it doesn’t feel right,
                mark <strong>NO</strong>.
              </li>
              <li>
                Only when both questions are <strong>YES</strong> is the load{" "}
                <strong>CLEAR TO LOAD</strong>.
              </li>
            </ol>

            <p className="qc-note" style={{ fontSize: "0.95rem" }}>
              Demo only. In the live system, your answers here will feed back
              into the AdbS Control Center and the Truck-Driver checks panel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
