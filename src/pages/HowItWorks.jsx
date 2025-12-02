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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HERO: TRANSPARENT LOGO + CENTERED TEXT */}
        <div
          style={{
            position: "relative",
            height: "520px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "url('/qc-logo.png')", // <-- use the new transparent logo
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain", // show whole logo, no cropping
          }}
        >
          {/* TEXT OVERLAY */}
          <div
            style={{
              textAlign: "center",
              maxWidth: "900px",
              padding: "12px 20px",
              color: "#f9fafb",
              textShadow: "0 4px 10px rgba(0, 0, 0, 0.95)", // makes it readable over chrome
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              How QueCab AdbS Works
            </h1>

            <h2
              style={{
                fontSize: "26px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              1 LINK. 3 CHECKS. INSTANT VERIFICATION.
            </h2>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "24px",
                lineHeight: 1.7,
              }}
            >
              <li>• What’s the USDOT# on the truck?</li>
              <li>• What’s the license plate number?</li>
              <li>• Did the driver answer their registered phone?</li>
            </ul>

            <p
              style={{
                marginTop: "24px",
                fontSize: "24px",
                fontWeight: 600,
              }}
            >
              ✓ YES = Cleared to Load
              <br />
              ✖ NO = Caution Alert (Hold This Load)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
