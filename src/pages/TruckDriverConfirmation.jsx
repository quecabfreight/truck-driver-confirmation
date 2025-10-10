import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./TruckDriverConfirmation.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function TruckDriverConfirmation() {
  const q = useQuery();
  const token = q.get("token") || "";
  const urlPhone = q.get("phone") || "";
  const urlUsdot = q.get("usdot") || "";
  const urlCompany = q.get("company") || "";

  // Try to read phone/usdot/company from the JWT payload if present.
  // If it fails, we fall back to the URL params.
  let payload = null;
  try {
    const body = token.split(".")[1];
    payload = body ? JSON.parse(atob(body)) : null;
  } catch {
    /* ignore */
  }

  const phone = payload?.phone || urlPhone || "";
  const usdot = payload?.usdot || urlUsdot || "";
  const company = payload?.company || urlCompany || "";
  const tokenOk = Boolean(token && phone && usdot);

  const [answers, setAnswers] = useState({ usdotOk: null, phoneAnswered: null });
  const ready = answers.usdotOk !== null && answers.phoneAnswered !== null;

  return (
    <div className="confirm-wrap">
      <h1>Truck Driver Confirmation</h1>
      {company && (
        <p className="subtle">
          Location: <strong>{company}</strong>
        </p>
      )}

      {!tokenOk ? (
        <>
          {/* When the link/token is bad, show only the error — no placeholder lines */}
          <p className="error">Provide a valid token in the URL.</p>
        </>
      ) : (
        <>
          {/* Facts — order swapped: USDOT first, then Driver Phone (clickable) */}
          <div className="facts">
            <div><strong>USDOT:</strong> {usdot}</div>
            <div>
              <strong>Driver Phone:</strong>{" "}
              <a href={`tel:${phone}`}>{formatPhone(phone)}</a>
            </div>
          </div>

          <div className="qblock">
            <p>Does the USDOT on the truck match?</p>
            <div className="yn-row">
              <button
                className={`yn-btn yes ${answers.usdotOk === true ? "active" : ""}`}
                onClick={() => setAnswers(a => ({ ...a, usdotOk: true }))}
              >
                Yes
              </button>
              <button
                className={`yn-btn no ${answers.usdotOk === false ? "active" : ""}`}
                onClick={() => setAnswers(a => ({ ...a, usdotOk: false }))}
              >
                No
              </button>
            </div>
          </div>

          <div className="qblock">
            <p>
              Did the driver answer their phone? (
              <a href={`tel:${phone}`}>call {formatPhone(phone)}</a>)
            </p>
            <div className="yn-row">
              <button
                className={`yn-btn yes ${answers.phoneAnswered === true ? "active" : ""}`}
                onClick={() => setAnswers(a => ({ ...a, phoneAnswered: true }))}
              >
                Yes
              </button>
              <button
                className={`yn-btn no ${answers.phoneAnswered === false ? "active" : ""}`}
                onClick={() => setAnswers(a => ({ ...a, phoneAnswered: false }))}
              >
                No
              </button>
            </div>
          </div>

          <button className="submit-btn" disabled={!ready}>
            Submit
          </button>
        </>
      )}
    </div>
  );
}

function formatPhone(p) {
  const d = (p || "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) {
    return `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  }
  return p || "—";
}
