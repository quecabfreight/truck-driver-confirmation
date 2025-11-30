export default function HowItWorks() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        color: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundImage: "url('/bg-howitworks.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "140px 40px",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          How QueCab AdbS Works
        </h1>

        <h2 style={{ fontSize: "22px", marginBottom: "20px", opacity: 0.9 }}>
          1 LINK. 3 CHECKS. INSTANT VERIFICATION.
        </h2>

        <ul style={{ fontSize: "20px", lineHeight: 1.5 }}>
          <li>• What’s the USDOT# on the truck?</li>
          <li>• What’s the license plate number?</li>
          <li>• Did the driver answer their registered phone?</li>
        </ul>

        <p style={{ marginTop: "20px", fontSize: "18px", opacity: 0.85 }}>
          ✓ YES = Cleared to Load  
          <br />✖ NO = Caution Alert (Hold This Load)
        </p>
      </div>
    </div>
  );
}
