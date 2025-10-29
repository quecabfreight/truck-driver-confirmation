import React from "react";

function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex flex-col">
      {/* Top bar / product header */}
      <div className="w-full flex items-center justify-between px-4 py-3 text-[11px] tracking-wide text-gray-300 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.6)]">
        {/* Left side of header */}
        <div className="flex flex-col leading-tight">
          <div className="font-semibold uppercase text-gray-200">
            QUECAB ADBS
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-medium">
            Carrier / Driver Verification Console
          </div>
        </div>

        {/* Right side of header */}
        <div className="text-right text-[10px] text-gray-500 leading-tight">
          <div className="text-gray-400 font-medium">
            Status: <span className="text-green-400">ONLINE</span>
          </div>
          <div className="">Live Monitoring Enabled</div>
        </div>
      </div>

      {/* Body area */}
      <div className="flex-1 w-full flex flex-col lg:flex-row items-start justify-start gap-6 px-4 py-6">

        {/* LEFT COLUMN: brand + access */}
        <div
          className="w-full max-w-md bg-[rgba(20,20,20,0.75)]
                     border border-[rgba(255,255,255,0.08)]
                     rounded-md shadow-[0_25px_60px_rgba(0,0,0,0.9)]
                     backdrop-blur-[6px]
                     p-4 text-gray-100"
        >
          {/* LOGO / NAME / TAGLINE */}
          <div className="mb-4">
            {/* Replace this with your real red truck / QueCab AdbS logo later */}
            <div className="text-[10px] font-bold text-gray-400 mb-2 leading-tight">
              LOGO
            </div>

            <div className="text-[14px] font-semibold text-gray-100 leading-tight">
              QueCab <span className="text-red-500 font-bold">AdbS</span>
            </div>
            <div className="text-[10px] text-gray-400 tracking-wide mt-1 uppercase">
              Anti-Double Brokering System
            </div>
          </div>

          {/* SHORT PITCH */}
          <div className="text-[12px] text-gray-300 leading-relaxed mb-4">
            Fast verification for the truck and driver at your dock.
            Keep bad carriers out. Stop load theft in real time.
            Document proof that you asked the right questions.
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-2">
            {/* LOGIN button */}
            <a
              href="/login"
              className="w-full text-center select-none
                         bg-red-600 hover:bg-red-700
                         text-white font-semibold tracking-wide
                         text-[12px] uppercase
                         rounded-[4px] border border-red-700/70
                         shadow-[0_15px_40px_rgba(255,0,0,0.3)]
                         px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-red-500/60"
            >
              Broker / Shipper Login
            </a>

            {/* REQUEST ACCESS link */}
            <a
              href="/join"
              className="w-full text-[11px] text-gray-400 hover:text-gray-200 text-left underline underline-offset-2 tracking-wide"
            >
              Need access? Request Authorization
            </a>
          </div>

          {/* LEGAL / NOTICE */}
          <div className="text-[10px] text-gray-500 leading-snug mt-4">
            Authorized use only. Activity may be monitored and recorded.
            By continuing you consent to monitoring.
          </div>
        </div>

        {/* RIGHT COLUMN: live verification preview */}
        <div className="flex-1 min-w-[240px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

          {/* BOX 1: LAST VERIFICATION */}
          <div
            className="bg-[rgba(20,20,20,0.75)]
                       border border-[rgba(255,255,255,0.08)]
                       rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.8)]
                       backdrop-blur-[6px]
                       p-4"
          >
            <div className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase mb-2">
              Last Verification
            </div>

            <div className="text-[12px] text-gray-200 leading-relaxed">
              USDOT# <span className="font-mono font-semibold text-gray-100">1234567</span>
              <br />
              Driver Phone: <span className="text-gray-300">(555) 222-9988</span>
              <br />
              Location: <span className="text-gray-300">Dock 3</span>
              <br />
              Result:{" "}
              <span className="font-semibold text-green-400">
                CLEAR TO LOAD
              </span>
            </div>

            <div className="text-[10px] text-gray-500 leading-snug mt-3">
              Timestamp recorded for audit trail.
            </div>
          </div>

          {/* BOX 2: ACTIVE FLAGS */}
          <div
            className="bg-[rgba(20,20,20,0.75)]
                       border border-[rgba(255,255,255,0.08)]
                       rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.8)]
                       backdrop-blur-[6px]
                       p-4"
          >
            <div className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase mb-2 flex items-center justify-between">
              <span>Active Flags</span>
              <span className="text-[10px] font-bold text-red-500 bg-[rgba(120,0,0,0.2)] border border-red-700/50 rounded px-2 py-[2px] leading-none shadow-[0_10px_30px_rgba(255,0,0,0.3)]">
                DO NOT LOAD
              </span>
            </div>

            <div className="text-[12px] text-gray-200 leading-relaxed">
              Mismatch: USDOT# on truck does not match paperwork.
              <br />
              Driver could not confirm phone.
            </div>

            <div className="text-[10px] text-gray-500 leading-snug mt-3">
              This triggers manual review. Load is on hold.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
