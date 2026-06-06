const payload = {
  legal_name: cleanBusinessName,
  legal_business_name: cleanBusinessName,
  business_name: cleanBusinessName,
  company_name: cleanBusinessName,

  contact_name: String(contactName || "").trim(),

  business_email: cleanEmail,
  email: cleanEmail,

  business_phone: String(businessPhone || "").trim(),
  phone: String(businessPhone || "").trim(),

  mc_number: onlyDigits(mcNumber),
  mc: onlyDigits(mcNumber),

  role: String(role || "broker").trim().toLowerCase(),

  beta_acknowledged: true,
  beta_notice_acknowledged: true,
  beta_notice_accepted: true,
  accepted_beta: true,
  beta_accepted: true,
  acknowledged_beta: true
};
