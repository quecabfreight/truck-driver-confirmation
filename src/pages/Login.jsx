import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [code, setCode] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (code.trim().length >= 6) {
      localStorage.setItem("qc_role", "checker");
      nav("/verify");
    } else {
      alert("Enter your 6+ char access code.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-100">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
        <h1 className="text-xl font-semibold mb-4">QueCab AdbS — Check-In Login</h1>
        <label className="block text-sm mb-2">Access Code</label>
        <input
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 outline-none focus:ring"
          placeholder="Enter code from your admin"
        />
        <button className="w-full rounded-xl py-2 bg-black text-white hover:opacity-90">Sign In</button>
        <p className="text-xs text-neutral-500 mt-3">
          This locally enables the phone link on the verify screen for authorized personnel only.
        </p>

        <div className="mt-4 text-center">
          <Link to="/join" className="text-blue-700 underline">Join QueCab AdbS</Link>
        </div>
      </form>
    </div>
  );
}
