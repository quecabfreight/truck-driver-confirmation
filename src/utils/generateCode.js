export function generateAccessCode(role = "broker") {
  const prefix = role === "shipper" ? "QC-SHP-" : "QC-BRK-";
  const n = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `${prefix}${n}`;
}
