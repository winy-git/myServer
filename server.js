const express = require('express');
const app = express();
const mariadb = require('mariadb');

// Set up views and view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Define routes
app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/about', function(req, res) {
    res.render('about.html');
});

// Create a MariaDB connection pool
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'my_password', 
  database: 'my_db',
  connectionLimit: 10
});

// Database route
app.get('/db', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const results = await connection.query('SELECT * FROM books');
    res.send(JSON.stringify(results));
    console.log('results', results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database query failed');
  } finally {
    if (connection) connection.release();
  }
});

// Start the server
const server = app.listen(3000, () => {
  console.log('Start Server : localhost:3000');
});