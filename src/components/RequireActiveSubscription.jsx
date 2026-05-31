import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthEmail } from "../utils/auth.js";

export default function RequireActiveSubscription({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    check();
  }, []);

  async function check() {
    try {
      const email = getAuthEmail();

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
        body: JSON.stringify({
          email
        })
      });

      const data = await res.json();

      if (
        res.ok &&
        data?.ok &&
        (
          data.subscription_status === "paid_active" ||
          data.account_type === "internal"
        )
      ) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    } catch {
      setAllowed(false);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0c121c",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 800
        }}
      >
        Verifying subscription...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}
