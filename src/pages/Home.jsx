import React from "react";

function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-gray-100 flex flex-col items-center">
      {/* Top brand text */}
      <header className="w-full max-w-[800px] text-center pt-8 pb-4">
        <div className="text-[20px] font-semibold text-gray-100 tracking-[-0.03em]">
          <span className="text-gray-100">QueCab</span>{" "}
          <span className="text-gray-300">AdbS</span>
        </div>
      </header>

      {/* Main card */}
      <main
        className="w-full max-w-[800px] mx-auto
                   rounded-2xl
                   border border-[rgba(255,255,255,0.08)]
                   shadow-[0_30px_120px_rgba(0,0,0,0.9)]
                   text-center
                   px-6 py-8
                   flex flex-col items-center"
        style={{
          backgroundColor: "rgba(15,15,15,0.6)",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(40,40,40,0.6) 0%, rgba(10,10,10,0.6) 60%)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Logo block */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="flex items-center justify-center rounded-xl
                       bg-[rgba(0,0,0,0.6)]
                       border border-[rgba(255,255,255,0.12)]
                       shadow-[0_20px_60px_rgba(0,0,0,0.9)]
                       p-4"
          >
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS Logo"
              style={{ width: "220px", maxWidth: "220px", height: "auto" }}
            />
          </div>

          <div className="text-[20px] font-semibold text-gray-100 mt-4 leading-tight">
            QueCab <span className="text-gray-300">AdbS</span>
          </div>

          <div className="text-[13px] text-gray-400 mt-1 leading-tight">
            Secure Your Load
          </div>
        </div>

        {/* Request Access */}
        <a
          href="/join"
          className="w-full max-w-[500px]
                     bg-[rgba(15,15,15,0.8)]
                     hover:bg-[rgba(20,20,20,0.9)]
                     text-gray-100
                     border border-[rgba(255,255,255,0.18)]
                     rounded-xl px-4 py-4 mb-3 transition-all
                     text-left shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col"
        >
          <div className="text-[15px] font-semibold tracking-[-0.03em] text-gray-100">
            Request Access
          </div>
          <div className="text-[12px] text-gray-400 mt-[2px]">
            Brokers / Shippers — apply for authorization
          </div>
        </a>

        {/* Login */}
        <a
          href="/login"
          className="w-full max-w-[500px]
                     bg-[rgba(15,15,15,0.8)]
                     hover:bg-[rgba(20,20,20,0.9)]
                     text-gray-100
                     border border-[rgba(255,255,255,0.18)]
                     rounded-xl px-4 py-4 mb-3 transition-all
                     text-left shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col"
        >
          <div className="text-[15px] font-semibold tracking-[-0.03em] text-gray-100">
            Already Authorized? Log In
          </div>
          <div className="text-[12px] text-gray-400 mt-[2px]">
            Use your QueCab AdbS code to unlock verification tools
          </div>
        </a>

        {/* What is QueCab AdbS? */}
        <div
          className="w-full max-w-[500px]
                     bg-[rgba(15,15,15,0.4)]
                     text-gray-100
                     border border-[rgba(255,255,255,0.08)]
                     rounded-xl px-4 py-4 mb-4 text-left
                     shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col"
        >
          <div className="text-[14px] font-semibold tracking-[-0.03em] text-gray-100 mb-1">
            What is QueCab AdbS?
          </div>
          <div className="text-[12px] text-gray-400 leading-relaxed">
            QueCab AdbS is an Anti-Double Brokering System. We confirm who is
            actually hauling your freight, and we warn you when something
            doesn’t match at the dock.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[800px] text-center text-[11px] text-gray-500 tracking-[-0.03em] py-6">
        Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab Inc.
      </footer>
    </div>
  );
}

export default Home;
