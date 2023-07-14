import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const filename = fileURLToPath(import.meta.url);
const filedirname = dirname(filename);

const configPath = join(filedirname, 'config.json');
const config = JSON.parse(readFileSync(configPath));

const firebaseAdminCredential = join(filedirname, config.firebaseAdminCredential);
const credentials = JSON.parse(readFileSync(firebaseAdminCredential, 'utf8'));

// Inisialisasi aplikasi Firebase
admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: config.databaseURL,
});

const db = admin.firestore();

export default db;
