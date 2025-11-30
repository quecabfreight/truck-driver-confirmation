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
        {/* HERO SECTION – image + centered text */}
        <div
          style={{
            width: "100%",
            minHeight: "420px",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundImage: "url('/bg-howitworks.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center top",
            backgroundColor: "#0b0f19", // steel-blue behind PNG
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 40px 40px 40px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "white",
              textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              maxWidth: "720px",
            }}
          >
            <h1
              style={{
                fontSize: "40px",
                marginBottom: "8px",
              }}
            >
              How QueCab AdbS Works
            </h1>

            <h2
              style={{
                fontSize: "22px",
                marginBottom: "20px",
                fontWeight: 600,
              }}
            >
              1 LINK. 3 CHECKS. INSTANT VERIFICATION.
            </h2>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "20px",
                lineHeight: 1.6,
              }}
            >
              <li>• What’s the USDOT# on the truck?</li>
              <li>• What’s the license plate number?</li>
              <li>• Did the driver answer their registered phone?</li>
            </ul>

            <p
              style={{
                marginTop: "18px",
                fontSize: "18px",
                lineHeight: 1.5,
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
