import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';

// Load ../.env explicitly (so running from /src works)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

// Try three credential sources in priority order:
// 1) FIREBASE_SERVICE_ACCOUNT_JSON (inline JSON in .env)
// 2) FIREBASE_SERVICE_ACCOUNT_B64 (base64-encoded JSON in .env)
// 3) GOOGLE_APPLICATION_CREDENTIALS (path to JSON file)
function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: ' + e.message);
    }
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch (e) {
      throw new Error('Failed to decode FIREBASE_SERVICE_ACCOUNT_B64: ' + e.message);
    }
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credPath = resolve(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (!fs.existsSync(credPath)) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS file not found: ' + credPath);
    }
    return JSON.parse(fs.readFileSync(credPath, 'utf8'));
  }
  // Default: try serviceAccountKey.json in project root
  const defaultPath = resolve(__dirname, '../serviceAccountKey.json');
  if (fs.existsSync(defaultPath)) {
    return JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
  }
  throw new Error('No Firebase service account credentials found');
}

if (!admin.apps.length) {
  const svc = loadServiceAccount();
  admin.initializeApp({ credential: admin.credential.cert(svc) });
}

export default admin;