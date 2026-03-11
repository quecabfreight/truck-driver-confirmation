import React from "react";
import {
  formatActivityTime,
  getActivityTime,
  getAttemptCount,
  getLoadStatusMeta,
} from "../utils/loadActivityStatus";

function stripStyles(tone) {
  if (tone === "danger") {
    return {
      background:
        "linear-gradient(135deg, rgba(120,0,0,0.92), rgba(55,0,0,0.92))",
      border: "1px solid rgba(255,100,100,0.45)",
      boxShadow: "0 0 0 1px rgba(255,120,120,0.08), 0 12px 28px rgba(80,0,0,0.35)",
    };
  }

  if (tone === "success") {
    return {
      background:
        "linear-gradient(135deg, rgba(12,90,50,0.92), rgba(10,50,34,0.92))",
      border: "1px solid rgba(90,220,150,0.35)",
      boxShadow: "0 0 0 1px rgba(120,255,180,0.06), 0 12px 28px rgba(0,40,20,0.28)",
    };
  }

  return {
    background:
      "linear-gradient(135deg, rgba(52,60,72,0.96), rgba(30,36,46,0.96))",
    border: "1px solid rgba(160,175,195,0.20)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 12px 28px rgba(0,0,0,0.18)",
  };
}

function valueOrDash(v) {
  const s = String(v ?? "").trim();
  return s ? s : "—";
}

export default function LoadIncidentCard({ item }) {
  const meta = getLoadStatusMeta(item);
  const attempts = getAttemptCount(item);
  const when = formatActivityTime(getActivityTime(item));

  const carrierCompany =
    item?.carrier_company ||
    item?.carrier_name ||
    item?.company ||
    "";

  const carrierContact =
    item?.carrier_contact_name ||
    item?.carrier_contact ||
    item?.dispatch_contact ||
    item?.contact_name ||
    "";

  const carrierPhone =
    item?.carrier_contact_phone ||
    item?.dispatch_phone ||
    item?.contact_phone ||
    "";

  const token =
    item?.token ||
    item?.smartlink_token ||
    item?.link_token ||
    "";

  const loadRef =
    item?.load_id ||
    item?.load_number ||
    item?.reference ||
    item?.shipment_ref ||
    "";

  const startsAt = formatActivityTime(item?.starts_at);
  const expiresAt = formatActivityTime(item?.expires_at);

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "rgba(18,22,29,0.84)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 18px 42px rgba(0,0,0,0.24)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          ...stripStyles(meta.tone),
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.84,
              marginBottom: 4,
              color: "#f3f6fb",
            }}
          >
            Status
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              textTransform: "uppercase",
              wordBreak: "break-word",
            }}
          >
            {meta.label}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(110px, 1fr))",
            gap: 10,
            width: "min(320px, 100%)",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                opacity: 0.82,
                color: "#f3f6fb",
                marginBottom: 4,
              }}
            >
              Attempts
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
              {attempts}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                opacity: 0.82,
                color: "#f3f6fb",
                marginBottom: 4,
              }}
            >
              Last Activity
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
              {when}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <InfoBox label="Carrier Company" value={valueOrDash(carrierCompany)} />
          <InfoBox label="Carrier Contact Name" value={valueOrDash(carrierContact)} />
          <InfoBox label="Carrier Contact Phone" value={valueOrDash(carrierPhone)} />
          <InfoBox label="Load Reference" value={valueOrDash(loadRef)} />
          <InfoBox label="Token" value={valueOrDash(token)} mono />
          <InfoBox label="Starts" value={startsAt} />
          <InfoBox label="Expires" value={expiresAt} />
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, mono = false }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "14px 14px 12px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "rgba(220,228,240,0.72)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#f7f9fc",
          lineHeight: 1.3,
          wordBreak: "break-word",
          fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "inherit",
        }}
      >
        {value}
      </div>
    </div>
  );
}
