import React, { useEffect, useMemo, useState } from "react";
import LoadIncidentCard from "../components/LoadIncidentCard";
import { sortLoadActivity } from "../utils/loadActivityStatus";

const DEMO_ROWS = [
  {
    id: "1",
    carrier_company: "ABC Logistics LLC",
    carrier_contact_name: "Mike Reynolds",
    carrier_contact_phone: "555-123-4567",
    load_number: "LD-24831",
    token: "ABDS-7G2K91",
    result: "CAUTION ALERT — DO NOT LOAD",
    attempts: 2,
    updated_at: new Date().toISOString(),
    starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "2",
    carrier_company: "Highline Transport",
    carrier_contact_name: "Daniel Ortiz",
    carrier_contact_phone: "555-222-0198",
    load_number: "LD-24829",
    token: "ABDS-9M5Q77",
    result: "CLEAR TO LOAD",
    attempts: 1,
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    starts_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "3",
    carrier_company: "North Ridge Freight",
    carrier_contact_name: "Angela Morris",
    carrier_contact_phone: "555-908-1100",
    load_number: "LD-24828",
    token: "ABDS-2V4B44",
    result: "",
    attempts: 0,
    updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    starts_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 10).toISOString(),
  },
];

export default function LoadActivity() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const maybeWindowRows =
          typeof window !== "undefined" && Array.isArray(window.__ADBS_LOAD_ACTIVITY__)
            ? window.__ADBS_LOAD_ACTIVITY__
            : null;

        if (maybeWindowRows && alive) {
          setRows(maybeWindowRows);
          setUsingDemo(false);
          return;
        }

        if (alive) {
          setRows(DEMO_ROWS);
          setUsingDemo(true);
        }
      } catch (err) {
        if (alive) {
          setError("Could not load Load Activity.");
          setRows(DEMO_ROWS);
          setUsingDemo(true);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const sortedRows = useMemo(() => sortLoadActivity(rows), [rows]);

  return (
    <div
      style={{
        minHeight: "100%",
        padding: 20,
        color: "#f6f8fb",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: 18,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(210,220,235,0.72)",
                marginBottom: 6,
              }}
            >
              Broker Eyes Only
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.08,
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              Load Activity
            </h1>
            <div
              style={{
                marginTop: 8,
                color: "rgba(220,228,238,0.78)",
                fontSize: 16,
                maxWidth: 780,
              }}
            >
              Highest urgency rises to the top. CAUTION ALERT items hit first, then CLEAR TO LOAD, then anything still awaiting verification.
            </div>
          </div>

          {usingDemo ? (
            <div
              style={{
                alignSelf: "center",
                padding: "10px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,200,100,0.22)",
                background: "rgba(100,70,10,0.18)",
                color: "#ffd88a",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Demo activity loaded
            </div>
          ) : null}
        </div>

        {error ? (
          <div
            style={{
              marginBottom: 16,
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid rgba(255,100,100,0.22)",
              background: "rgba(90,0,0,0.18)",
              color: "#ffb7b7",
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div
            style={{
              padding: 22,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(18,22,29,0.78)",
              color: "rgba(230,236,244,0.84)",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Loading activity…
          </div>
        ) : sortedRows.length === 0 ? (
          <div
            style={{
              padding: 22,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(18,22,29,0.78)",
              color: "rgba(230,236,244,0.84)",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            No load activity yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {sortedRows.map((item, index) => (
              <div key={item?.id || item?.token || index}>
                <LoadIncidentCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
