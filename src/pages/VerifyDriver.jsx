import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getVerifyDetails,
  submitTruckDriverCheck,
} from "../utils/demoApi.js";

function toUpper(value) {
  return (value || "").toUpperCase();
}

function formatPhoneForTel(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  return digits ? `tel:${digits}` : "";
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
  const [linkRecord, setLinkRecord] = useState(null);
  const [linkError, setLinkError] = useState(null);

  useEffect(() => {
    // Load link details from demo "backend"
    const rec = getVerifyDetails(token);
    if (!rec) {
      setLinkError(
        "This AdbS Truck-Driver Verify Link is not found or has expired. Do NOT load off this link."
      );
    } else {
      setLinkRecord(rec);
    }
  }, [token]);

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
      nextValue = toUpper(nextValue);
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
          "Answer all three checks: USDOT#, plate, and whether the driver answered their registered phone.",
      });
      return;
    }

    const clearToLoad =
      form.usdotMatches === "yes" && form.driverAnswered === "yes";

    const result = submitTruckDriverCheck(token, {
      usdotOnTruck: form.usdotOnTruck,
      plateOnTruck: form.plateOnTruck,
      usdotMatches: form.usdotMatches,
      driverAnswered: form.driverAnswered,
    });

    if (!result.ok) {
      setStatus({
        type: "error",
        message:
          "This verify link is no longer valid in this demo. Do NOT load off this link.",
      });
      return;
    }

    if (clearToLoad) {
      setStatus({
        type: "success",
        message:
          "CLEAR TO LOAD – USDOT#, plate, and driver phone check all passed for this Truck-Driver unit.",
      });
    } else {
      setStatus({
        type: "caution",
        message:
          "CAUTION ALERT – DO NOT LOAD. At least one check failed. Hold this load and follow your internal escalation steps.",
      });
    }
  }

  const driverPhone = linkRecord?.driverPhone || "";
  const driverTelHref = formatPhoneForTel(driverPhone);

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

          {linkRecord && (
            <div className="qc-dash-link-summary">
              <p>
                <strong>Load:</strong> {linkRecord.loadReference || "N/A"}
              </p>
              <p>
                <strong>Carrier:</strong> {linkRecord.carrierName || "N/A"}
              </p>
              <p>
                <strong>On record (USDOT / Plate):</strong>{" "}
                {linkRecord.usdotOnRecord || "N/A"} /{" "}
                {linkRecord.plateOnRecord || "N/A"}
              </p>
            </div>
          )}

          {linkError && (
            <div
              className="qc-status qc-status-caution"
              style={{
                color: "#ff4d4f",
                borderColor: "#ff4d4f",
                fontWeight: 600,
                marginTop: "1rem",
              }}
            >
              {linkError}
            </div>
          )}
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

            {pinUnlocked && !linkError && (
              <>
                <div className="qc-divider" />

                <h2 className="qc-dash-title">Verify the Truck-Driver</h2>
                <p className="qc-dash-text">
                  Enter what you see on the truck for USDOT# and plate, then
                  complete all three checks below. All must be{" "}
                  <strong>YES</strong> to clear the load.
                </p>

                <form className="qc-form" onSubmit={handleSubmit}>
                  <div className="qc-form-grid-single">
                    {/* USDOT ON TRUCK */}
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

                    {/* PLATE ON TRUCK */}
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

                    {/* USDOT MATCHES? */}
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

                    {/* DRIVER ANSWERED? + CALL DRIVER */}
                    <div className="qc-field">
                      <label className="qc-label">
                        DID THE DRIVER ANSWER THEIR REGISTERED PHONE?{" "}
                        {driverPhone && driverTelHref && (
                          <>
                            <a
                              href={driverTelHref}
                              className="qc-link-call"
                              style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
                            >
                              Call Driver
                            </a>
                            <a
                              href={driverTelHref}
                              className="qc-link-call-number"
                            >
                              {driverPhone}
                            </a>
                          </>
                        )}
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
                      style={
                        status.type === "caution"
                          ? {
                              color: "#ff4d4f",
                              borderColor: "#ff4d4f",
                              fontWeight: 600,
                            }
                          : undefined
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

          {/* RIGHT – Instructions / checklist */}
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
                Use the <strong>Call Driver</strong> control (or a desk phone)
                to call the driver’s registered number. If it doesn’t feel
                right, mark <strong>NO</strong>.
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
