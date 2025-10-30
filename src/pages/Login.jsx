import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email and password are required.");
      return;
    }
    // TODO: replace with real auth
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex flex-col">
      <div className="w-full flex items-center justify-between px-4 py-3 text-[11px] tracking-wide text-gray-300 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.6)]">
        <div className="font-semibold uppercase text-gray-200">QUECAB ADBS</div>
        <div className="text-[10px] text-gray-500 uppercase font-medium">Secure Login</div>
      </div>

      <div className="flex-1 w-full flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md bg-[rgba(20,20,20,0.75)] border border-[rgba(255,255,255,0.08)] rounded-md shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-[6px] p-4 text-gray-100">
          <div className="flex flex-col text-left mb-4">
            <div className="text-[10px] font-bold text-gray-400 mb-2 leading-tight">LOGO</div>
            <div className="text-[13px] font-semibold text-gray-100 leading-tight">
              QueCab <span className="text-red-500 font-bold">AdbS</span>
            </div>
            <div className="text-[10px] text-gray-400 tracking-wide mt-1 uppercase">
              Broker / Shipper Access
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 text-[12px] font-semibold text-red-400 bg-[rgba(120,0,0,0.2)] border border-[rgba(255,0,0,0.4)] rounded px-3 py-2 leading-snug">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-[11px] font-semibold text-gray-300 tracking-wide mb-1 uppercase">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.18)] rounded-[4px] px-3 py-2 text-[13px] text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-[11px] font-semibold text-gray-300 tracking-wide mb-1 uppercase">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.18)] rounded-[4px] px-3 py-2 text-[13px] text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="rememberDevice"
                type="checkbox"
                className="mt-[3px] h-4 w-4 bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.4)] rounded-[2px] checked:bg-red-600 checked:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
              />
              <label htmlFor="rememberDevice" className="text-[11px] text-gray-300 leading-snug select-none">
                Remember this device
                <div className="text-[10px] text-gray-500 leading-snug">Do not use on shared / public equipment.</div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full select-none bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide text-[12px] uppercase rounded-[4px] border border-red-700/70 shadow-[0_15px_40px_rgba(255,0,0,0.3)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/60"
            >
              Sign In
            </button>
          </form>

          <div className="mt-5 flex flex-col text-left gap-3">
            <a href="/join" className="text-[11px] text-gray-400 hover:text-gray-200 underline underline-offset-2 tracking-wide text-left">
              Need access? Request Authorization
            </a>
            <div className="text-[10px] text-gray-500 leading-snug">
              Authorized use only; activity may be monitored and recorded. By continuing you consent to monitoring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
