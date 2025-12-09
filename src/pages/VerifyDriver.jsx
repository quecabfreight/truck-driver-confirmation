import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY = "adbsv1-demo-links";

function loadStoredLinks() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function findLinkByToken(token) {
  if (!token) return null;
  const list = loadStoredLinks();
  return list.find((item) => item.token === token) || null;
}

function formatUpper(value) {
  return (value || "").toUpperCase();
}

export default function VerifyDriver() {
  const { token } = useParams();

  const [pinInput, setPinInput] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);

  const [form, setForm] = useState({
    usdotOnTruck: "",
    plateOnTruck: "",
    driverAnswered: "",
  });

  const [status, setStatus] = useState(null);
  const [linkData, setLinkData] = useState(null);
  const [linkNotFound, setLinkNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    const found = findLinkByToken(token);
    if (found) {
      setLinkData(found);
      setLinkNotFound(false);
    } else {
      setLinkData(null);
      setLinkNotFound(true);
    }
  }, [token]);

  function handleUnlock(e) {
    e.preventDefault();
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

  const driverPhone = linkData?.driverPhone || "123-456-7890";
  const driverPhoneDigits = driverPhone.replace(/\D/g, "");

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

          {token && (
            <p className="qc-note qc-mono">
              Demo token: <span>{token}</span>
            </p>
          )}

          {linkData && (
            <div className="qc-link-summary">
              <p className="qc-mono">
                <strong>Load:</strong> {linkData.loadReference || "N/A"}
              </p>
              <p className="qc-mono">
                <strong>Carrier:</strong> {linkData.carrierName || "N/A"}
              </p>
              <p className="qc-mono">
                <strong>On record (USDOT / Plate):</strong>{" "}
                {linkData.usdotOnRecord || "?"} /{" "}
                {linkData.plateOnRecord || "?"}
              </p>
            </div>
          )}

          {linkNotFound && (
            <p className="qc-status qc-status-error qc-mt-sm">
              This demo token was not found in the current browser session. Issue a
              new link from the AdbS Control Center, then open the new Verify link.
            </p>
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

            {pinUnlocked && (
              <>
                <div className="qc-divider" />

                <h2 className="qc-dash-title">Verify the Truck-Driver</h2>
                <p className="qc-dash-text">
                  Enter what you see on the truck, then call the driver and mark
                  whether they answered their registered phone. All checks must
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
                      <label className="qc-label qc-label-inline">
                        DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
                      </label>
                      <div className="qc-call-row">
                        <a
                          href={
                            driverPhoneDigits
                              ? `tel:${driverPhoneDigits}`
                              : undefined
                          }
                          className="qc-btn-secondary qc-btn-sm"
                        >
                          Call Driver
                        </a>
                        <span className="qc-phone-inline">
                          {driverPhone && (
                            <a
                              href={
                                driverPhoneDigits
                                  ? `tel:${driverPhoneDigits}`
                                  : undefined
                              }
                              className="qc-inline-link"
                            >
                              {driverPhone}
                            </a>
                          )}
                        </span>
                      </div>
                      <div className="qc-radio-row qc-mt-xs">
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

          {/* RIGHT – DOCK CHECKLIST */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Dock Checklist</h2>
            <ol className="qc-list">
              <li>Ask the driver to remain in the cab or waiting area.</li>
              <li>
                Confirm you are on the correct AdbS verify screen for this
                load.
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
                Only when all checks are <strong>YES</strong> is the load{" "}
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
