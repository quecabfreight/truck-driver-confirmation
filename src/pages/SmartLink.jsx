import React, { useMemo, useState } from "react";

function makeToken(len = 9) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function SmartLink() {
  const [token, setToken] = useState("");
  const driverUrl = useMemo(() => (token ? `/#/s/${token}` : ""), [token]);
  const dockUrl = useMemo(() => (token ? `/#/verify/${token}` : ""), [token]);

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
        Demo only. Generates a random token and displays the Driver & Dock URLs.
      </p>

      <div className="row-actions" style={{ marginTop: 8 }}>
        <button className="btn primary" onClick={gen} type="button">Generate Token</button>
        {token && <span className="tag">Token: <code>{token}</code></span>}
      </div>

      {token && (
        <table className="table">
          <thead>
            <tr><th>Type</th><th>URL</th><th></th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Driver link</td>
              <td><code>{driverUrl}</code></td>
              <td><button className="btn" onClick={() => copy(driverUrl)} type="button">Copy</button></td>
            </tr>
            <tr>
              <td>Dock link</td>
              <td><code>{dockUrl}</code></td>
              <td><button className="btn" onClick={() => copy(dockUrl)} type="button">Copy</button></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
