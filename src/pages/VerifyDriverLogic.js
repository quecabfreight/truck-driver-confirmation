// Step 7: src/pages/VerifyDriverLogic.js

// This file handles the logic and conditional flow of the verification process
// It is imported and used inside VerifyDriver.jsx

export function evaluateVerification(doesDotMatch, didPhoneAnswer) {
  const lowerDOT = doesDotMatch.trim().toLowerCase();
  const lowerPhone = didPhoneAnswer.trim().toLowerCase();

  if (lowerDOT === "yes" && lowerPhone === "yes") {
    return {
      status: "clear",
      message: "✅ CLEAR TO LOAD",
      color: "#28a745", // green
    };
  } else {
    return {
      status: "caution",
      message: "⚠️ CAUTION ALERT — DO NOT LOAD",
      color: "#dc3545", // red
    };
  }
}
