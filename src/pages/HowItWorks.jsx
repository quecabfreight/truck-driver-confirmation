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
            backgroundColor: "#0b0f19", // behind transparent areas of PNG
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 20px 30px 20px",
          }}
        >
          {/* TEXT BOX WITH BLACK FONT */}
          <div
            style={{
              maxWidth: "780px",
              textAlign: "center",
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: "20px 28px",
              borderRadius: "14px",
            }}
          >
            <h1
              style={{
                fontSize: "40px",
                marginBottom: "8px",
                color: "#000000",
              }}
            >
              How QueCab AdbS Works
            </h1>

            <h2
              style={{
                fontSize: "22px",
                marginBottom: "18px",
                fontWeight: 600,
                color: "#000000",
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
                fontSize: "18px",
                lineHeight: 1.5,
                color: "#000000",
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
