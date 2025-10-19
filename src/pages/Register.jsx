import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatPhone } from "../utils/formatPhone";
import { generateAccessCode } from "../utils/generateCode";
import "./verify.css"; // reuse the same design tokens + base styles

export default function Register() {
  const [role, setRole] = useState("broker"); // "broker" | "shipper"
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [mcUsdDot, setMcUsdDot] = useState("");
  const [website, setWebsite] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");

  const phone = useMemo(()=>formatPhone(orgPhone), [orgPhone]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!orgName.trim()) return alert("Enter organization name.");
    if (!orgEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgEmail)) return alert("Enter a valid company email.");
    if (!phone.replace(/\D/g,"")) return alert("Enter business phone.");
    if (!mcUsdDot.trim()) return alert("Enter MC or USDOT.");

    const newCode = generateAccessCode(role); // QC-BRK-xxxxx or QC-SHP-xxxxx
    setCode(newCode);
    setSubmitted(true);

    // Store locally (demo). Replace later with real API call.
    const record = { role, orgName, contactName, orgEmail, phone, mcUsdDot, website, code: newCode, createdAt: new Date().toISOString() };
    const list = JSON.parse(localStorage.getItem("qc_pending_apps") || "[]");
    list.push(record);
    localStorage.setItem("qc_pending_apps", JSON.stringify(list));
  }

  if (submitted) {
    const roleWord = role === "broker" ? "broker" : "shipper";
    const line = role === "broker"
      ? `Welcome to QueCab AdbS — your broker access code is ${code}`
      : `Welcome to QueCab AdbS — your shipper access code is ${code}`;

    const mailto = `mailto:${encodeURIComponent(orgEmail)}?subject=${encodeURIComponent("Your QueCab AdbS Access Code")}&body=${encodeURIComponent(`${line}\n\nOrganization: ${orgName}\nContact: ${contactName || "-"}\nPhone: ${phone}\nMC/USDOT: ${mcUsdDot}\nWebsite: ${website || "-"}`)}`;

    return (
      <div className="min-h-screen grid place-items-center bg-neutral-100">
        <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold mb-3">Registration Submitted</h1>
          <p className="mb-4 text-sm text-neutral-600">Save this for your records and share it with your check-in personnel.</p>

          <div className="bg-black text-white rounded-xl p-4 mb-4">
            <div className="text-base font-semibold mb-2">{line}</div>
            <div className="text-xs opacity-80">Example format shown. In production, approval & email can be automated.</div>
          </div>

          <div className="grid gap-2 text-sm">
            <Row label="Organization">{orgName}</Row>
            <Row label="Role">{roleWord[0].toUpperCase() + roleWord.slice(1)}</Row>
            <Row label="Access Code">{code}</Row>
            <Row label="Contact">{contactName || "—"}</Row>
            <Row label="Email">{orgEmail}</Row>
            <Row label="Phone">{phone}</Row>
            <Row label="MC / USDOT">{mcUsdDot}</Row>
            <Row label="Website">{website || "—"}</Row>
          </div>

          <div className="flex gap-8 mt-5">
            <button
              className="rounded-xl py-2 px-3 bg-black text-white"
              onClick={() => navigator.clipboard.writeText(line)}
            >
              Copy Message
            </button>
            <a className="rounded-xl py-2 px-3 border border-black" href={mailto}>
              Email This
            </a>
          </div>

          <div className="mt-6 flex items-center gap-10">
            <Link to="/login" className="text-blue-700 underline">Go to Login</Link>
            <Link to="/verify" className="text-blue-700 underline">Go to Verify</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-100">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-3">Broker / Shipper Registration</h1>
        <p className="mb-4 text-sm text-neutral-600">
          Apply for access. Once verified, you’ll receive an authorization code to enable your team at check-in.
        </p>

        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="broker" checked={role==="broker"} onChange={()=>setRole("broker")} />
            Broker
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="shipper" checked={role==="shipper"} onChange={()=>setRole("shipper")} />
            Shipper
          </label>
        </div>

        <Field label="Organization Name" value={orgName} onChange={setOrgName} required />
        <Field label="Contact Name" value={contactName} onChange={setContactName} />
        <Field label="Company Email" type="email" value={orgEmail} onChange={setOrgEmail} required />
        <Field label="Business Phone" value={phone} onChange={(v)=>setOrgPhone(v)} placeholder="123-456-7890" required />
        <Field label="MC / USDOT" value={mcUsdDot} onChange={setMcUsdDot} required />
        <Field label="Website (optional)" value={website} onChange={setWebsite} placeholder="https://..." />

        <button className="w-full rounded-xl py-2 bg-black text-white hover:opacity-90 mt-2">Submit Registration</button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-700 underline">Already have a code? Log in</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type="text", placeholder="", required=false }) {
  return (
    <label className="block mb-3">
      <div className="text-sm mb-1">{label}{required ? " *" : ""}</div>
      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring"
      />
    </label>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4">
      <div className="text-neutral-500">{label}</div>
      <div className="font-medium text-right">{children}</div>
    </div>
  );
}
