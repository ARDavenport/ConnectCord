
const readline = require('readline');
const mysql = require('mysql2');
const util = require('util');


const connection = mysql.createConnection({
  host: 'localhost',
  database: 'connectcordDB' 
});


const query = util.promisify(connection.query).bind(connection);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const question = (queryText) => new Promise(resolve => rl.question(queryText, resolve));

async function main() {
  try {
    connection.connect(err => {
        if (err) throw err;
        console.log('Connected to Connectcord database');
    });

    const userID = await question('Enter User ID: ');
    const major = await question('Enter a major: ');


    const sql = "INSERT INTO userProfile (userID, major) VALUES (?, ?)";


    const result = await query(sql, [userID, major]);
    console.log(`1 record inserted with ID: ${result.insertId}`);

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {

    rl.close();
    connection.end();
  }
}

main();
