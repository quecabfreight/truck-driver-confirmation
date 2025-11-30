export default function HowItWorks() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        padding: "40px 0",
        background: "linear-gradient(180deg, #0b0f19 0%, #131e33 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "95%",
          maxWidth: "1300px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "18px",
          padding: "40px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* HERO IMAGE */}
        <div
          style={{
            width: "100%",
            borderRadius: "18px",
            overflow: "hidden",
            marginBottom: "30px",
          }}
        >
          <img
            src="/bg-howitworks.jpg"
            alt="How It Works Hero"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* TEXT CONTENT */}
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
            color: "white",
          }}
        >
          How QueCab AdbS Works
        </h1>

        <h2
          style={{
            fontSize: "22px",
            marginBottom: "20px",
            color: "white",
            opacity: 0.85,
          }}
        >
          1 LINK. 3 CHECKS. INSTANT VERIFICATION.
        </h2>

        <ul style={{ fontSize: "20px", color: "white", lineHeight: 1.6 }}>
          <li>• What’s the USDOT# on the truck?</li>
          <li>• What’s the license plate number?</li>
          <li>• Did the driver answer their registered phone?</li>
        </ul>

        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: "white",
            opacity: 0.85,
            lineHeight: 1.5,
          }}
        >
          ✓ YES = Cleared to Load  
          <br />
          ✖ NO = Caution Alert (Hold This Load)
        </p>
      </div>
    </div>
  );
}
