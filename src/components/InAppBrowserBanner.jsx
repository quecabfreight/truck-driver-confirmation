import React, { useMemo, useState } from "react";

function isiOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function isAndroid() {
  return /Android/.test(navigator.userAgent);
}
function isInAppBrowser() {
  const ua = navigator.userAgent || "";
  // Common in-app browsers
  return /(FBAN|FBAV|Instagram|Line|Twitter|Snapchat|TikTok|GSA|GMail|Outlook|Pinterest|Discord|Slack)/i.test(ua);
}

export default function InAppBrowserBanner() {
  const [hidden, setHidden] = useState(false);
  const inApp = useMemo(() => isInAppBrowser(), []);
  const onIOS = useMemo(() => isiOS(), []);
  const onAndroid = useMemo(() => isAndroid(), []);

  if (!inApp || hidden) return null;

  const href = location.href;

  const openInChromeAndroid = () => {
    // Try Android intent to open in Chrome; if not supported, fall back to copy
    const origin = location.origin.replace(/^https?:\/\//, "");
    const path = location.href.replace(/^https?:\/\//, "").replace(origin, "");
    const intent = `intent://${origin}${path}#Intent;scheme=https;package=com.android.chrome;end`;
    location.href = intent;
    // If nothing happens, user can tap Copy Link below.
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(href);
      alert("Link copied. Paste into Safari/Chrome.");
    } catch {
      // no-op
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "var(--card-bg, #222)",
        color: "var(--text, #fff)",
        borderBottom: "1px solid var(--divider, #444)",
        padding: "12px 14px",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>
        For camera access: open in {onIOS ? "Safari" : "Chrome"}.
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        {onAndroid && (
          <button className="btn" type="button" onClick={openInChromeAndroid}>
            Open in Chrome
          </button>
        )}
        <button className="btn" type="button" onClick={copyLink}>
          Copy Link
        </button>
        <button className="btn" type="button" onClick={() => setHidden(true)} title="Dismiss">
          ×
        </button>
      </div>
    </div>
  );
}
