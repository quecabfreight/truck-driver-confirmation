import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);

  // basic error message placeholder (auth fail, etc.)
  const [errorMsg, setErrorMsg] = useState("");

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic required check (front-end only right now)
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email and password are required.");
      return;
    }

    // TODO: call your real auth API here.
    // We’ll just simulate success for now.
    // Later we’ll hook this to backend auth and store a session token.
    const fakeIsValid = true;

    if (fakeIsValid) {
      // if rememberDevice is true, this is where we'd persist
      // to localStorage or similar in the future.
      // (Not implemented yet — we're just capturing the choice.)
      console.log("Login attempt:", {
        email,
        rememberDevice,
      });

      // After successful login, route them where the app lands post-auth.
      // For now let's assume dashboard route will be "/"
      navigate("/");
    } else {
      setErrorMsg("Invalid credentials.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8
                 bg-[rgba(0,0,0,0.8)] bg-cover bg-center"
      // ^ NOTE: background overlay stays dark and serious.
      // The actual dock / industrial background image should still
      // be applied globally (e.g. in index.css / App wrapper).
      // We're just making sure this panel sits correctly on top.
    >
      {/* Card / Panel */}
      <div
        className="w-full max-w-md bg-[rgba(20,20,20,0.75)]
                   border border-[rgba(255,255,255,0.08)]
                   shadow-[0_25px_60px_rgba(0,0,0,0.9)]
                   rounded-xl p-6 backdrop-blur-[6px]
                   text-gray-100"
      >
        {/* Logo + Product header */}
        <div className="flex flex-col items-center text-center mb-6">
          {/* Replace this div with the actual QueCab AdbS logo <img /> you already have. 
             Keep same sizing you used on Phase 1 screens.
             I'm putting a placeholder <div> box with text so you know where it goes. */}
          <div className="w-16 h-16 mb-2 flex items-center justify-center
                          bg-[rgba(255,255,255,0.05)]
                          border border-[rgba(255,255,255,0.12)]
                          rounded-md text-xs font-semibold tracking-wide text-gray-200 select-none">
            LOGO
          </div>

          <div className="text-lg font-semibold text-gray-100 leading-tight">
            QueCab <span className="text-red-500 font-bold">AdbS</span>
          </div>
          <div className="text-[11px] text-gray-400 tracking-wide mt-1 uppercase">
            Broker / Shipper Access
          </div>
        </div>

        {/* Optional error bar */}
        {errorMsg && (
          <div className="mb-4 text-[13px] font-semibold text-red-400 bg-[rgba(120,0,0,0.2)]
                          border border-[rgba(255,0,0,0.4)]
                          rounded px-3 py-2 leading-snug">
            {errorMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-[12px] font-semibold text-gray-300 tracking-wide mb-1 uppercase"
            >
              Business Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full bg-[rgba(0,0,0,0.6)]
                         border border-[rgba(255,255,255,0.18)]
                         rounded-md px-3 py-2 text-[14px] text-gray-100
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-red-500/60
                         focus:border-red-500/60"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-[12px] font-semibold text-gray-300 tracking-wide mb-1 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full bg-[rgba(0,0,0,0.6)]
                         border border-[rgba(255,255,255,0.18)]
                         rounded-md px-3 py-2 text-[14px] text-gray-100
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-red-500/60
                         focus:border-red-500/60"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* REMEMBER THIS DEVICE */}
          <div className="flex items-start gap-2">
            <input
              id="rememberDevice"
              type="checkbox"
              className="mt-[3px] h-4 w-4
                         bg-[rgba(0,0,0,0.6)]
                         border border-[rgba(255,255,255,0.4)]
                         rounded-[2px]
                         checked:bg-red-600 checked:border-red-600
                         focus:outline-none focus:ring-2 focus:ring-red-500/60"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
            />
            <label
              htmlFor="rememberDevice"
              className="text-[12px] text-gray-300 leading-snug select-none"
            >
              Remember this device
              <div className="text-[11px] text-gray-500 leading-snug">
                Do not use on shared / public equipment.
              </div>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full select-none
                       bg-red-600 hover:bg-red-700
                       text-white font-semibold tracking-wide
                       text-[14px] uppercase
                       rounded-md border border-red-700/70
                       shadow-[0_15px_40px_rgba(255,0,0,0.3)]
                       px-4 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-red-500/60"
          >
            Sign In
          </button>
        </form>

        {/* FOOTER LINKS */}
        <div className="mt-6 flex flex-col items-center text-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/join")}
            className="text-[12px] text-gray-400 hover:text-gray-200
                       underline underline-offset-2 tracking-wide"
          >
            Need access? Request authorization
          </button>

          <div className="text-[10px] text-gray-500 leading-snug max-w-[260px]">
            Authorized use only. Activity may be monitored and recorded.
            By continuing you consent to monitoring.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
