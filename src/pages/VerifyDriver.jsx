import Layout from "../components/Layout";

export default function Verify() {
  // NOTE: This is still a demo-only screen. No live data or matches.
  // The "on record (USDOT / Plate)" line has been fully removed on purpose.
  // Dock / check-in staff will enter what they see or what the driver gives them;
  // the system will compare that to what the broker/shipper has on file behind the scenes.

  const pageStyle = {
    padding: "32px 16px 72px",
  };

  const shellStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headingStyle = {
    fontSize: "2.1rem",
    fontWeight: 800,
    marginBottom: "6px",
  };

  const subheadingStyle = {
    fontSize: "0.98rem",
    opacity: 0.9,
    marginBottom: "18px",
    maxWidth: "720px",
  };

  const summaryStyle = {
    fontSize: "0.9rem",
    marginBottom: "18px",
    lineHeight: 1.5,
  };

  const summaryRowStyle = {
    marginBottom: "4px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
    gap: "20px",
  };

  const cardStyle = {
    background:
      "linear-gradient(145deg, rgba(5,10,22,0.98), rgba(3,6,14,0.98))",
    borderRadius: "18px",
    padding: "18px 18px 20px",
    boxShadow: "0 22px 50px rgba(0,0,0,0.9)",
    border: "1px solid rgba(148,163,184,0.35)",
  };

  const cardTitleStyle = {
    fontSize: "1.05rem",
    fontWeight: 600,
    marginBottom: "10px",
  };

  const pinLabelStyle = {
    fontSize: "0.85rem",
    marginBottom: "6px",
    opacity: 0.9,
  };

  const pinInputStyle = {
    width: "100%",
    boxSizing: "border-box",
    height: "44px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.7)",
    backgroundColor: "rgba(2,6,17,0.98)",
    color: "#f9fafb",
    padding: "0 12px",
    fontSize: "1rem",
    outline: "none",
    marginBottom: "10px",
  };

  const pinButtonStyle = {
    width: "100%",
    height: "42px",
    borderRadius: "999px",
    border: "none",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    background:
      "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#ffffff",
    boxShadow:
      "0 0 0 1px rgba(0,0,0,0.6), 0 12px 28px rgba(0,0,0,0.9)",
  };

  const dockNoteStyle = {
    fontSize: "0.8rem",
    opacity: 0.8,
    marginTop: "10px",
  };

  const checklistListStyle = {
    fontSize: "0.86rem",
    lineHeight: 1.55,
    paddingLeft: "18px",
    margin: 0,
  };

  const checklistNoteStyle = {
    fontSize: "0.8rem",
    opacity: 0.82,
    marginTop: "12px",
  };

  return (
    <Layout pageTitle="Truck-Driver Verification">
      <main className="page-container verify-page" style={pageStyle}>
        <div className="content-shell" style={shellStyle}>
          <h1 style={headingStyle}>Truck-Driver Verification</h1>
          <p style={subheadingStyle}>
            For authorized dock and check-in personnel only. Confirm the
            Truck-Driver unit (truck + driver) in real time before you open a
            door or touch a pallet.
          </p>

          {/* Summary section – DEMO values only */}
          <div style={summaryStyle}>
            <div style={summaryRowStyle}>
              <strong>Demo token:</strong> DEMO-U0I0EZ
            </div>
            <div style={summaryRowStyle}>
              <strong>Load:</strong> 12345
            </div>
            <div style={summaryRowStyle}>
              <strong>Carrier:</strong> ABC Trucking
            </div>
            {/* IMPORTANT:
                The "On record (USDOT / Plate)" line was intentionally removed.
                No on-record identifiers are shown to dock staff on this screen. */}
          </div>

          <div style={gridStyle}>
            {/* LEFT: Dock PIN */}
            <section style={cardStyle}>
              <h2 style={cardTitleStyle}>Dock Access PIN</h2>
              <p style={pinLabelStyle}>
                In the live system, every dock or check-in station will have its
                own PIN. Drivers never see this screen.
              </p>
              <input
                type="password"
                style={pinInputStyle}
                value="••••••"
                readOnly
              />
              <button type="button" style={pinButtonStyle}>
                Unlock
              </button>
              <p style={dockNoteStyle}>
                Demo only. In the live system, entering the correct PIN unlocks
                this station for the Truck-Driver verification steps.
              </p>
            </section>

            {/* RIGHT: Dock checklist */}
            <section style={cardStyle}>
              <h2 style={cardTitleStyle}>Dock Checklist</h2>
              <ol style={checklistListStyle}>
                <li>Ask the driver to remain in the cab or waiting area.</li>
                <li>
                  Confirm you are on the correct AdbS verify screen for this
                  load.
                </li>
                <li>
                  Enter the <strong>USDOT#</strong> and{" "}
                  <strong>license plate</strong> exactly as given by the driver
                  or as seen on the truck.
                </li>
                <li>
                  Use the <strong>Call Driver</strong> button (or a desk phone)
                  to call the driver&apos;s registered number. If it doesn&apos;t
                  feel right, mark NO.
                </li>
                <li>
                  Only when all checks pass and the phone check is{" "}
                  <strong>YES</strong> is the load CLEAR TO LOAD.
                </li>
              </ol>
              <p style={checklistNoteStyle}>
                Demo only. In the live system, your answers here will feed back
                into the AdbS Control Center and the Truck-Driver record for
                this load.
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}
