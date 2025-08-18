// back-end/src/firebaseAdmin.js (ESM)
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Load ../.env explicitly (so running from /src works)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

// Try three credential sources in priority order:
// 1) FIREBASE_SERVICE_ACCOUNT_JSON (inline JSON in .env)
// 2) FIREBASE_SERVICE_ACCOUNT_B64 (base64-encoded JSON in .env)
// 3) GOOGLE_APPLICATION_CREDENTIALS (path to JSON file)
function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    return JSON.parse(raw);
  }
  throw new Error('No Firebase service account env var found');
}

if (!admin.apps.length) {
  const svc = loadServiceAccount();
  if (svc) {
    admin.initializeApp({ credential: admin.credential.cert(svc) });
  } else {
    // falls back to GOOGLE_APPLICATION_CREDENTIALS file
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
}

export default admin;