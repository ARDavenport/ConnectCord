// switch to SQLite
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'ConnectCord.db'), (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
        throw err;
    }
});

console.log('Connected to SQLite database');

// test out query
try {
    const rows = db.prepare('SELECT * FROM Users').all();
    // console.log(rows);
} catch (err) {
    console.error('Error querying SQLite database:', err);
    throw err;
}

export default db;