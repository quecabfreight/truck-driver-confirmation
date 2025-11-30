export default function HowItWorks() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        padding: "40px 0",
        background: "linear-gradient(180deg, #050814 0%, #0b0f19 40%, #131e33 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "95%",
          maxWidth: "1300px",
        }}
      >
        {/* HERO IMAGE AREA (EXACTLY LIKE BEFORE — NO PANELS, NO BOXES) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src="/bg-howitworks.jpg"
            alt="How It Works"
            style={{
              width: "100%",
              maxWidth: "900px",
              height: "auto",
            }}
          />
        </div>

        {/* TEXT — EXACT SAME POSITIONING, ONLY COLOR CHANGED TO BLACK */}
        <h1
          style={{
            fontSize: "42px",
            marginTop: "-380px",   // pulls text upward OVER THE IMAGE exactly like yours
            marginBottom: "10px",
            textAlign: "center",
            color: "#000000",
            fontWeight: "700",
          }}
        >
          How QueCab AdbS Works
        </h1>

        <h2
          style={{
            fontSize: "24px",
            textAlign: "center",
            marginBottom: "20px",
            color: "#000000",
            fontWeight: "600",
          }}
        >
          1 LINK. 3 CHECKS. INSTANT VERIFICATION.
        </h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 auto",
            textAlign: "center",
            fontSize: "20px",
            lineHeight: 1.6,
            color: "#000000",
          }}
        >
          <li>• What’s the USDOT# on the truck?</li>
          <li>• What’s the license plate number?</li>
          <li>• Did the driver answer their registered phone?</li>
        </ul>

        <p
          style={{
            marginTop: "18px",
            fontSize: "20px",
            textAlign: "center",
            color: "#000000",
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
