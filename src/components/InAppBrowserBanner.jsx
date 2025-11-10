import React, { useMemo, useState } from "react";

function isiOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; }
function isAndroid() { return /Android/.test(navigator.userAgent); }
function isInAppBrowser() {
  const ua = navigator.userAgent || "";
  return /(FBAN|FBAV|Instagram|Line|Twitter|Snapchat|TikTok|GSA|GMail|Outlook|Pinterest|Discord|Slack|WhatsApp|WeChat)/i.test(ua);
}

export default function InAppBrowserBanner({ message }) {
  const [hidden, setHidden] = useState(false);
  const inApp = useMemo(() => isInAppBrowser(), []);
  const onIOS = useMemo(() => isiOS(), []);
  const onAndroid = useMemo(() => isAndroid(), []);

  if (!inApp || hidden) return null;

  const href = location.href;

  const openInChromeAndroid = () => {
    const intent = `intent://${href.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
    location.href = intent;
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(href); alert("Link copied. Open Safari/Chrome and paste."); } catch {}
  };

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: "#ffefc2", color: "#111", borderBottom: "1px solid #d7c38a",
      padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", borderRadius: 12, marginBottom: 12
    }}>
      <div style={{ fontWeight: 900 }}>
        {message || "Camera and file access may be blocked in this app."} Open in {onIOS ? "Safari" : "Chrome"} for best results.
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        {onAndroid && <button className="btn" type="button" onClick={openInChromeAndroid}>Open in Chrome</button>}
        <button className="btn" type="button" onClick={copyLink}>Copy Link</button>
        <button className="btn" type="button" onClick={() => setHidden(true)} title="Dismiss">×</button>
      </div>
    </div>
  );
}
