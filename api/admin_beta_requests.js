if (status === "approved") {
  url += `&approved=eq.true`;
} else if (status === "pending") {
  url += `&or=(${enc("approved.is.null")},${enc("approved.eq.false")})`;
}
