import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthEmail } from "../utils/auth.js";

function clean(v) {
  return String(v || "").trim().toLowerCase();
}

export default function RequireActiveSubscription({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  async function checkSubscription() {
    try {
      const email = clean(getAuthEmail());

      if (!email) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/check_subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      const accountType = clean(data?.account_type);
      const subscriptionStatus = clean(data?.subscription_status);
      const accountStatus = clean(data?.status);

      const isActiveAccount =
        accountStatus === "active" ||
        accountStatus === "";

      const isInternal =
        accountType === "internal" ||
        subscriptionStatus === "internal";

      const isPaid =
        subscriptionStatus === "paid_active" ||
        subscriptionStatus === "active" ||
        subscriptionStatus === "trialing";

      if (res.ok && data?.ok && isActiveAccount && (isInternal || isPaid)) {
        setAllowed(true);
      } else {
        console.log("Subscription gate blocked:", data);
        setAllowed(false);
      }
    } catch (err) {
      console.log("Subscription gate error:", err);
      setAllowed(false);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        Verifying account access...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}

const styles = {
  loadingPage: {
    minHeight: "100vh",
    background: "#0c121c",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 800
  }
};
