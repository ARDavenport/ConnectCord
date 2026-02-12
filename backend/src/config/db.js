// switch to mySQL
import mySQL from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password:'115227',
    database: 'ConnectCord'
});

connection.connect((err) => {
    // test out connection
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        throw err;
    }
    console.log('Connected to MySQL database');

    // test out query
    connection.query("USE ConnectCord", function (err, result) { 
        if (err) throw err;
        console.log("Database changed to ConnectCord");

        connection.query('SELECT * FROM Users;', (err, results) => {
            if (err) {
                console.error('Error querying to MySQL database:', err);
                throw err;
            }
            // console.log(results);
        });
    });
    

    /* dont' close this connection
    // end connection after
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL database:', err);
            throw err;
        }
        console.log("Connection closed:)");
    });
    */

});




export default connection.promise();




// export { prisma, connectDB, disconnectDB };
// export everything, should be in server.js

