import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpperClean(s) {
  return String(s || "").toUpperCase();
}

function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function makeQrDataUrl(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(clean)}`;
}

export default function ControlCenter() {

const nav = useNavigate();
const email = (localStorage.getItem(LS_EMAIL) || "").trim();
const authorized = !!email && isBrokerOrShipper(email);

const loadIdRef = useRef(null);

useEffect(() => {
if (!authorized) {
nav("/login", { replace: true });
return;
}
setTimeout(() => {
loadIdRef.current?.focus();
}, 0);
}, [authorized, nav]);

if (!authorized) return null;

const [loadId, setLoadId] = useState("");
const [dockEmail, setDockEmail] = useState("");
const [carrierCompany, setCarrierCompany] = useState("");
const [carrierContact, setCarrierContact] = useState("");
const [carrierPhone, setCarrierPhone] = useState("");
const [driverPhone, setDriverPhone] = useState("");
const [usdotOnRecord, setUsdotOnRecord] = useState("");
const [plateOnRecord, setPlateOnRecord] = useState("");

const [statusMsg, setStatusMsg] = useState("");
const [errorMsg, setErrorMsg] = useState("");

const [emailStatus, setEmailStatus] = useState("");
const [emailDebug, setEmailDebug] = useState(null);
const [emailError, setEmailError] = useState("");

const [issued, setIssued] = useState(null);
const [issuedQr, setIssuedQr] = useState("");

async function issueLink() {

setErrorMsg("");
setStatusMsg("");
setEmailStatus("");
setEmailDebug(null);
setEmailError("");

const usdot_digits = onlyDigits(usdotOnRecord);
const plate_upper = toUpperClean(plateOnRecord).trim();
const phone_digits = onlyDigits(driverPhone);

if (!usdot_digits) {
setErrorMsg("Enter USDOT#");
return;
}

if (!plate_upper) {
setErrorMsg("Enter Plate");
return;
}

if (phone_digits.length !== 10) {
setErrorMsg("Enter Driver Phone");
return;
}

try {

const payload = {
load_id: loadId || null,
dock_email: dockEmail || null,
carrier_company: carrierCompany || null,
dispatch_contact: carrierContact || null,
dispatch_phone: formatPhoneHyphen(carrierPhone),
driver_phone: formatPhoneHyphen(driverPhone),
usdot_on_record: usdot_digits,
plate_on_record: plate_upper
};

const res = await fetch("/api/issue_verify_link", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload)
});

const data = await res.json();

if (!res.ok) {
setErrorMsg(data.error || "Issue failed");
return;
}

const verifyUrl = data.verify_url || "";
const qrDataUrl = makeQrDataUrl(verifyUrl);

setIssued({
verification_id: data.token,
verify_url: verifyUrl,
status: data.status || "active"
});

setIssuedQr(qrDataUrl);

setStatusMsg("AdbS Verification issued");

setEmailStatus(data.email_status || "");
setEmailDebug(data.email_debug || null);
setEmailError(data.email_error || "");

} catch {
setErrorMsg("Network error");
}

}

const input = {
width: "100%",
padding: 12,
borderRadius: 12,
border: "1px solid rgba(255,255,255,0.16)",
background: "rgba(255,255,255,0.05)",
color: "#fff",
fontSize: 16
};

const btn = {
width: "100%",
padding: 12,
borderRadius: 12,
border: "1px solid rgba(120,180,255,0.45)",
background: "rgba(40,110,190,0.35)",
fontWeight: 900,
cursor: "pointer"
};

return (

<div style={{ minHeight: "100vh" }}>

<Header />

<div style={{ maxWidth: 960, margin: "0 auto", padding: "18px 16px 48px" }}>

<div style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
Control Center
</div>

<div style={{ display: "grid", gap: 10 }}>

<input
ref={loadIdRef}
style={input}
placeholder="Load ID"
value={loadId}
onChange={e => setLoadId(e.target.value)}
/>

<input
style={input}
placeholder="Dock Email"
value={dockEmail}
onChange={e => setDockEmail(e.target.value)}
/>

<input
style={input}
placeholder="Carrier Company"
value={carrierCompany}
onChange={e => setCarrierCompany(e.target.value)}
/>

<input
style={input}
placeholder="Carrier Contact Name"
value={carrierContact}
onChange={e => setCarrierContact(e.target.value)}
/>

<input
style={input}
placeholder="Carrier Contact Phone"
value={carrierPhone}
onChange={e => setCarrierPhone(formatPhoneHyphen(e.target.value))}
/>

<input
style={input}
placeholder="Driver Phone"
value={driverPhone}
onChange={e => setDriverPhone(formatPhoneHyphen(e.target.value))}
/>

<input
style={input}
placeholder="USDOT#"
value={usdotOnRecord}
onChange={e => setUsdotOnRecord(onlyDigits(e.target.value))}
/>

<input
style={input}
placeholder="Plate"
value={plateOnRecord}
onChange={e => setPlateOnRecord(toUpperClean(e.target.value))}
/>

<button style={btn} onClick={issueLink}>
Issue AdbS Verification
</button>

{errorMsg && (
<div style={{ color: "#ff7b7b" }}>{errorMsg}</div>
)}

{statusMsg && (
<div>{statusMsg}</div>
)}

{emailStatus && (
<div style={{ marginTop: 6 }}>
Email Status: <b>{emailStatus}</b>
</div>
)}

{emailError && (
<div style={{ color: "#ff7b7b" }}>
Email Error: {emailError}
</div>
)}

{emailDebug && (
<div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
Email Debug:
<pre>{JSON.stringify(emailDebug, null, 2)}</pre>
</div>
)}

</div>

{issued && (
<div style={{ marginTop: 20 }}>

<div style={{ fontWeight: 900 }}>Verification ID</div>
<input style={input} value={issued.verification_id} readOnly />

<div style={{ marginTop: 10, fontWeight: 900 }}>
AdbS SmartLink
</div>
<input style={input} value={issued.verify_url} readOnly />

<div style={{ marginTop: 16, textAlign: "center" }}>
{issuedQr && (
<img
src={issuedQr}
alt="QR"
style={{
width: 240,
background: "#fff",
padding: 10,
borderRadius: 10
}}
/>
)}
</div>

</div>
)}

</div>

</div>

);
}
