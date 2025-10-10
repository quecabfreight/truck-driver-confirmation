// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// CORS + JSON parsing
app.use(cors());            // for dev; tighten origins later
app.use(express.json());

const SECRET = process.env.SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 4000;

// Where your React app reads the link (can override in .env)
// Example for prod: CONFIRM_BASE=https://app.quecab.com/confirm
const CONFIRM_BASE = process.env.CONFIRM_BASE || 'http://localhost:5173/confirm';

// Health check
app.get('/health', (_req, res) => res.send('OK'));

/**
 * Sign endpoint (GET or POST)
 * Required: usdot, phone
 * Optional: minutes (default 60), company (shown on confirmation page)
 * Responds with: { token, url, company, expiresInMinutes }
 */
app.all('/sign', (req, res) => {
  const src = req.method === 'POST' ? req.body : req.query;

  const usdot   = String(src.usdot || '').trim();
  const phone   = String(src.phone || '').trim();
  const company = String(src.company || '').trim().slice(0, 80);   // keep short for UI
  const minutesRaw = parseInt(src.minutes || '60', 10);
  const minutes = Number.isFinite(minutesRaw) ? Math.max(1, minutesRaw) : 60;

  if (!usdot || !phone) {
    return res.status(400).json({ error: 'usdot and phone are required' });
  }

  // Include minimal claims in the token
  const token = jwt.sign({ usdot, phone, company }, SECRET, { expiresIn: `${minutes}m` });

  // Build the Smart Link the carrier clicks (or the dock opens)
  const url =
    `${CONFIRM_BASE}` +
    `?token=${encodeURIComponent(token)}` +
    `&phone=${encodeURIComponent(phone)}` +
    `&usdot=${encodeURIComponent(usdot)}` +
    `&company=${encodeURIComponent(company)}`;

  return res.json({ token, url, company, expiresInMinutes: minutes });
});

// Start server
app.listen(PORT, () => {
  console.log(`Signer server listening on http://localhost:${PORT}`);
});
