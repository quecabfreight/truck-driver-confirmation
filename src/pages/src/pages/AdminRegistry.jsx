import { useState, useMemo } from "react";

const LS_KEY = "qca_orgs";

function loadOrgs() {
  return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
}
function saveOrgs(orgs) {
  localStorage.setItem(LS_KEY, JSON.stringify(orgs));
}

export default function AdminRegistry() {
  const [orgs, setOrgs] = useState(loadOrgs());
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.domains.some(d => d.toLowerCase().includes(q)) ||
      o.org_id.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  }, [orgs, search]);

  function addOrg() {
    if (!name.trim() || !domain.trim()) return;
    const org = {
      org_id: "org_" + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      domains: [domain.trim().startsWith("@") ? domain.trim() : "@" + domain.trim()],
      status: "active",
      createdAt: Date.now()
    };
    const next = [...orgs, org];
    setOrgs(next);
    saveOrgs(next);
    setName(""); setDomain("");
  }

  function toggleStatus(id) {
    const next = orgs.map(o => o.org_id === id ? { ...o, status: o.status === "active" ? "suspended" : "active" } : o);
    setOrgs(next); saveOrgs(next);
  }

  return (
    <div style={{minHeight:"100vh", background:"#f7f7f8", padding:24, fontFamily:"system-ui, sans-serif"}}>
      <div style={{maxWidth:900, margin:"0 auto"}}>
        <h1 style={{margin:"0 0 10px 0"}}>Org Registry (Demo)</h1>
        <p style={{marginTop:0, opacity:.7}}>Add brokers/shippers, control status. This simulates your future backend.</p>

        <div style={{display:"grid", gap:10, gridTemplateColumns:"1fr 1fr auto", alignItems:"end", marginBottom:16}}>
          <label>
            <div>Org Name</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Big Shipper Inc." style={inputStyle}/>
          </label>
          <label>
            <div>Primary Email Domain</div>
            <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="@bigshipper.com" style={inputStyle}/>
          </label>
          <button onClick={addOrg} style={btnStyle}>Add Org</button>
        </div>

        <div style={{display:"flex", gap:10, marginBottom:10}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orgs…" style={{...inputStyle, flex:1}}/>
          <a href="/issue" style={{...btnStyle, textDecoration:"none", display:"inline-grid", placeItems:"center"}}>Go to Issue</a>
        </div>

        <div style={{background:"#fff", borderRadius:12, boxShadow:"0 6px 18px rgba(0,0,0,.06)"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr style={{textAlign:"left", background:"#f1f3f6"}}>
                <th style={th}>Org</th>
                <th style={th}>Domains</th>
                <th style={th}>Org ID</th>
                <th style={th}>Status</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.org_id} style={{borderTop:"1px solid #eee"}}>
                  <td style={td}><strong>{o.name}</strong></td>
                  <td style={td}>{o.domains.join(", ")}</td>
                  <td style={td} title={String(o.createdAt)}>{o.org_id}</td>
                  <td style={td}><span style={{fontWeight:800, color:o.status==="active"?"#2E7D32":"#C62828"}}>{o.status.toUpperCase()}</span></td>
                  <td style={td}>
                    <button onClick={()=>toggleStatus(o.org_id)} style={btnSmall}>
                      {o.status === "active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td style={{...td, opacity:.7}} colSpan={5}>No orgs. Add one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width:"100%", padding:10, borderRadius:10, border:"1px solid #ddd" };
const btnStyle = { padding:"10px 14px", border:0, borderRadius:10, background:"#111", color:"#fff", fontWeight:800, cursor:"pointer" };
const btnSmall = { ...btnStyle, padding:"8px 10px" };
const th = { padding:"10px 12px", fontSize:12, opacity:.7 };
const td = { padding:"12px" };
