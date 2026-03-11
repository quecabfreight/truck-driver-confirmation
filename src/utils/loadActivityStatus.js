export function getLoadStatusMeta(item = {}) {
  const raw =
    item?.status ||
    item?.result ||
    item?.verification_result ||
    item?.latest_result ||
    item?.verdict ||
    "";

  const value = String(raw).trim().toUpperCase();

  if (
    value.includes("CAUTION") ||
    value.includes("DO NOT LOAD") ||
    value === "FAILED" ||
    value === "FAIL" ||
    value === "LOCKED"
  ) {
    return {
      key: "caution",
      label: "CAUTION ALERT — DO NOT LOAD",
      tone: "danger",
      priority: 3,
    };
  }

  if (
    value.includes("CLEAR TO LOAD") ||
    value === "CLEAR" ||
    value === "PASSED" ||
    value === "PASS" ||
    value === "VERIFIED"
  ) {
    return {
      key: "clear",
      label: "CLEAR TO LOAD",
      tone: "success",
      priority: 2,
    };
  }

  return {
    key: "awaiting",
    label: "Awaiting Verification",
    tone: "neutral",
    priority: 1,
  };
}

export function getAttemptCount(item = {}) {
  const v =
    item?.attempt_count ??
    item?.attempts ??
    item?.verification_attempts ??
    item?.tries ??
    0;

  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function getActivityTime(item = {}) {
  return (
    item?.updated_at ||
    item?.checked_at ||
    item?.last_checked_at ||
    item?.verified_at ||
    item?.created_at ||
    item?.issued_at ||
    null
  );
}

export function formatActivityTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function sortLoadActivity(items = []) {
  return [...items].sort((a, b) => {
    const aMeta = getLoadStatusMeta(a);
    const bMeta = getLoadStatusMeta(b);

    if (bMeta.priority !== aMeta.priority) {
      return bMeta.priority - aMeta.priority;
    }

    const aTime = new Date(getActivityTime(a) || 0).getTime();
    const bTime = new Date(getActivityTime(b) || 0).getTime();

    return bTime - aTime;
  });
}
