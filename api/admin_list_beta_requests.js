const url =
  `${SUPABASE_URL}/rest/v1/beta_requests` +
  `?select=id,created_at,business_email,status,approved,access_code,legal_business_name,role,business_phone` +
  `&order=created_at.desc` +
  `&limit=50`;
