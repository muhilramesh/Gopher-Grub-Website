import { Low, JSONFile } from 'lowdb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up LowDB
const file = path.join(__dirname, 'data', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

(async () => {
  await db.read();
  db.data.reviews = [];
  await db.write();
  console.log('All reviews have been cleared.');
})();
