import React, { useMemo, useState } from "react";

function makeToken(len = 9) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const phoneMask = (val) => {
  const d = val.replace(/\D/g, "").slice(0, 10);
  const a = d.slice(0, 3), b = d.slice(3, 6), c = d.slice(6, 10);
  if (d.length > 6) return `${a}-${b}-${c}`;
  if (d.length > 3) return `${a}-${b}`;
  return a;
};

const usdotMask = (val) => val.replace(/\D/g, "").slice(0, 10);
const plateMask = (val) => val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

export default function SmartLink() {
  const [token, setToken] = useState("");
  const [bolUsdot, setBolUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    if (bolUsdot) params.set("bol", bolUsdot);
    if (plate) params.set("plate", plate);
    if (phone) params.set("phone", phone);
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [bolUsdot, plate, phone]);

  const driverUrl = useMemo(
    () => (token ? `/#/s/${token}` : ""),
    [token]
  );
  const dockUrl = useMemo(
    () => (token ? `/#/verify/${token}${qs}` : ""),
    [token, qs]
  );

  const gen = () => setToken(makeToken(9));

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied.");
    } catch {
      prompt("Copy URL:", text);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0, marginBottom: 6 }}>Create Smart Link</h2>
      <p className="subtle" style={{ marginTop: 0 }}>
        Optional: prefill B.O.L. data so dock staff only confirms.
      </p>

      <div className="form" style={{ marginTop: 8 }}>
        <div>
          <div className="form-label">B.O.L. USDOT# (optional prefill)</div>
          <input
            className="input"
            placeholder="e.g., 1234567"
            value={bolUsdot}
            onChange={(e) => setBolUsdot(usdotMask(e.target.value))}
          />
        </div>
        <div>
          <div className="form-label">License Plate (optional prefill)</div>
          <input
            className="input"
            placeholder="e.g., ABC12345"
            value={plate}
            onChange={(e) => setPlate(plateMask(e.target.value))}
          />
        </div>
        <div>
          <div className="form-label">Driver/Dispatcher Phone (optional prefill)</div>
          <input
            className="input"
            placeholder="123-456-7890"
            value={phone}
            onChange={(e) => setPhone(phoneMask(e.target.value))}
          />
        </div>

        <div className="row-actions" style={{ marginTop: 6 }}>
          <button className="btn primary" onClick={gen} type="button">Generate Token</button>
          {token && <span className="tag">Token: <code>{token}</code></span>}
        </div>
      </div>

      {token && (
        <table className="table">
          <thead>
            <tr><th>Type</th><th>URL</th><th></th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Driver link</td>
              <td style={{wordBreak:"break-all"}}><code>{driverUrl}</code></td>
              <td><button className="btn" onClick={() => copy(driverUrl)} type="button">Copy</button></td>
            </tr>
            <tr>
              <td>Dock link</td>
              <td style={{wordBreak:"break-all"}}><code>{dockUrl}</code></td>
              <td><button className="btn" onClick={() => copy(dockUrl)} type="button">Copy</button></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
