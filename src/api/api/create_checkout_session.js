function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  return json(res, 200, {
    ok: true,
    message: "create_checkout_session function is alive",
    method: req.method
  });
}
