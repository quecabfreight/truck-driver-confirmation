import React, { useState } from "react";
import { useParams } from "react-router-dom";

function formatUpper(value) {
  return value.toUpperCase();
}

export default function VerifyDriver() {
  const { token } = useParams();

  const [form, setForm] = useState({
    usdotOnTruck: "",
    plateOnTruck: "",
    usdotMatches: "",
    driverAnswered: "",
  });

  const [status, setStatus] = useState(null);

  const DEMO_DRIVER_PHONE = "123-456-7890";
  const telHref = "tel:" + DEMO_DRIVER_PHONE.replace(/[^0-9]/g, "");

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
          <h1 className="qc-heading">Truck-Driver Verification</h1>
          <p className="qc-sub">
            For authorized dock and check-in personnel only. Confirm the
            Truck-Driver unit (truck + driver) in real time before you open a
            door or touch a pallet.
          </p>
          <p className="qc-note qc-mono">
            Demo token: <span>{token || "N/A"}</span>
          </p>
        </header>

        <div className="qc-dash-grid qc-dash-grid-2">
          {/* LEFT – main verification panel */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Dock Access PIN</h2>
            <p className="qc-dash-text">
              In the live system, every dock or check-in station will have its
              own internal PIN. Drivers never see this screen.
            </p>

            <div className="qc-divider" />

            <h2 className="qc-dash-title">Verify the Truck-Driver</h2>
            <p className="qc-dash-text">
              Enter what you see on the truck, then work straight down the two
              questions. Both must be <strong>YES</strong> to clear the load.
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
                    License Plate on Truck <span className="qc-required">*</span>
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
                      <span>YES</span>
                    </label>
                    <label className="qc-radio">
                      <input
                        type="radio"
                        name="usdotMatches"
                        value="no"
                        checked={form.usdotMatches === "no"}
                        onChange={handleChange}
                      />
                      <span>NO</span>
                    </label>
                  </div>
                </div>

                <div className="qc-field">
                  <label className="qc-label qc-label-row">
                    <span>DID THE DRIVER ANSWER THEIR REGISTERED PHONE? </span>
                    <a href={telHref} className="qc-call-btn">
                      Call Driver
                    </a>
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
                <button type="submit" className="qc-btn-primary qc-btn-wide">
                  Submit Truck-Driver Check
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT – dock checklist */}
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
                Use the <strong>Call Driver</strong> button to reach the
                driver’s registered phone. If it doesn’t feel right, mark{" "}
                <strong>NO</strong>.
              </li>
              <li>
                Only when both questions are <strong>YES</strong> is the load{" "}
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
