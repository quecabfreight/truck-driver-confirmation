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
      {/* HERO WRAPPER */}
      <div
        style={{
          width: "95%",
          maxWidth: "1200px",
          height: "600px",
          backgroundImage: "url('/bg-howitworks.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",  // keeps logo fully visible
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* CENTERED TEXT OVER LOGO */}
        <div
          style={{
            textAlign: "center",
            color: "white",
            textShadow: "0px 4px 10px rgba(0,0,0,0.85)",
            maxWidth: "900px",
            padding: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            How QueCab AdbS Works
          </h1>

          <h2
            style={{
              fontSize: "28px",
              fontWeight: 600,
              marginBottom: "28px",
            }}
          >
            1 LINK. 3 CHECKS. INSTANT VERIFICATION.
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "26px",
              lineHeight: 1.7,
            }}
          >
            <li>• What’s the USDOT# on the truck?</li>
            <li>• What’s the license plate number?</li>
            <li>• Did the driver answer their registered phone?</li>
          </ul>

          <p
            style={{
              marginTop: "28px",
              fontSize: "26px",
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
  );
}
