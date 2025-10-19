export function formatPhone(v = "") {
  const digits = v.replace(/\D/g, "").slice(0, 10);
  const m = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!m) return v;
  const [, a, b, c] = m;
  let out = "";
  if (a) out += a;
  if (b) out += (out ? "-" : "") + b;
  if (c) out += (out ? "-" : "") + c;
  return out;
}
