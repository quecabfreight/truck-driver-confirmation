import { useMemo, useState } from "react";

/* -----------------------
   Helpers (MVP, local only)
------------------------ */
function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
function saveAuth(auth) {
  const all = JSON.parse(localStorage.getItem("qca_auth") || "[]");
  const next = all.filter(a => a.code !== auth.code).concat(auth);
  localStorage.setItem("qca_auth", JSON.stringify(next));
}
function loadOrgs() {
  return JSON.parse(localStorage.getItem("qca_orgs") || "[]");
}
function getActiveOrg() {
  const orgs = loadOrgs();
  // MVP: just use the first ACTIVE org (later: match issuer's email domain)
  return orgs.find(o => o.status === "active") || null;
}

/* -----------------------
   Component
------------------------ */
export default function Issue() {
  const org = getActiveOrg(); // <-- WHO is issuing

  // If no ACTIVE org, show a simple guard message
  if (!org) {
    return (
      <div style={{minHeight:"100vh", display:"grid", placeItems:"center", fontFamily:"system-ui, sans-serif", background:"#f7f7f8", padding:24}}>
        <div style={{maxWidth:600, background:"#fff", padding:24, borderRadius:16, boxShadow:"0 10px 30px rgba(0,0,0,.08)"}}>
          <h2 style={{marginTop:0}}>Issue Authorization</h2>
          <div style={{padding:14, borderRadius:10, background:"#FFEBEE", color:"#B71C1C", fontWeight:800}}>
            No ACTIVE organization found. Go to <a href="/admin/registry">Org Registry</a> and add/activate one.
          </div>
        </div>
      </div>
    );
  }

  const [usdot, setUsdot] = useState("");
  const [phone, setPhone] = useState("");
  const [expiresMins, setExpiresMins] = useState(240);
  const [loadRef, setLoadRef] = useState(""); // optional Load/PO
  const [issued, setIssued] = useState(null);

  const valid = useMemo(() => usdot.trim().length > 0, [usdot]);

  function issue() {
    if (!valid) return;

    const code = makeCode();
    const expiresAt = Date.now() + (Number(expiresMins) || 60) * 60 * 1000;

    const params = new URLSearchParams();
    params.set("usdot", usdot.trim());
    if (phone.trim()) params.set("phone", phone.replace(/[^\d+]/g, ""));
    params.set("code", code);
    if (loadRef.trim()) params.set("ref", loadRef.trim());

    const link = `${location.origin}/verify?${params.toString()}`;

    // 🔴 THIS is the record saved to localStorage. We now include org_id + org_name.
    const rec = {
      code,
      usdot: usdot.trim(),
      phone: phone.replace(/[^\d+]/g, ""),
      loadRef: loadRef.trim(),
      expiresAt,
      link,
      createdAt: Date.now(),

      // 👇 Added fields so Verify can check org status later
      org_id: org.org_id,
      org_name: org.name,
    };

    saveAuth(rec);
    setIssued(rec);
  }

  const card = { maxWidth: 860, margin: "40px auto", padding: 24, borderRadius: 16, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.08)", fontFamily: "system-ui, sans-serif" };
  const label = { display: "block", marginBottom: 14 };
  const input = { width: "100%", marginTop: 6, padding: 12, borderRadius: 10, border: "1px solid #ddd", fontSize: 18 };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f8", padding: 24 }}>
      <div style={card}>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Issue Authorization</div>
        <p style={{ marginTop: 0, opacity: .7 }}>
          Issuer: <strong>{org.name}</strong> <span style={{opacity:.6}}>({org.org_id})</span>
        </p>

        <label style={label}>
          <span style={{ fontWeight: 700 }}>Expected USDOT#</span>
          <input style={input} value={usdot} onChange={e=>setUsdot(e.target.value)} inputMode="numeric" placeholder="e.g., 1234567" required />
        </label>

        <label style={label}>
          <span style={{ fontWeight: 700 }}>Driver Phone (optional)</span>
          <input style={input} value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" placeholder="e.g., 5855551212" />
        </label>

        <label style={label}>
          <span style={{ fontWeight: 700 }}>Load/PO # (optional)</span>
          <input style={input} value={loadRef} onChange={e=>setLoadRef(e.target.value)} placeholder="e.g., PO-8891" />
        </label>

        <label style={label}>
          <span style={{ fontWeight: 700 }}>Expires in (minutes)</span>
          <input style={input} type="number" min="5" step="5" value={expiresMins} onChange={e=>setExpiresMins(e.target.value)} />
        </label>

        <button onClick={issue} disabled={!valid} style={{ width:"100%", padding:14, border:0, borderRadius:12, fontWeight:800, cursor:"pointer", background: valid ? "#111" : "#999", color:"#fff" }}>
          Issue Authorization
        </button>

        {issued && (
          <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "#F3F6FF", border:"1px solid #dfe6ff" }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Authorization Created</div>
            <div><strong>Org:</strong> {issued.org_name} <span style={{opacity:.6}}>({issued.org_id})</span></div>
            <div><strong>Code:</strong> {issued.code}</div>
            {issued.loadRef && <div><strong>Ref:</strong> {issued.loadRef}</div>}
            <div><strong>Expires:</strong> {new Date(issued.expiresAt).toLocaleString()}</div>
            <div style={{ marginTop: 8, wordBreak:"break-all" }}>
              <strong>Verify Link:</strong> <a href={issued.link}>{issued.link}</a>
            </div>
            <div style={{ marginTop: 12 }}>
              <img
                alt="QR"
                width="180" height="180"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(issued.link)}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
