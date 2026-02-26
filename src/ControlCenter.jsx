// /src/ControlCenter.jsx
// Safety wrapper:
// The real Control Center lives at /src/pages/ControlCenter.jsx.
// This file exists ONLY to prevent confusion if anything imports "/src/ControlCenter.jsx".

import React from "react";
import ControlCenter from "./pages/ControlCenter.jsx";

export default function ControlCenterWrapper() {
  return <ControlCenter />;
}
