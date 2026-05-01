const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // cambia por tu usuario
  password: '',        // cambia por tu contraseña
  database: 'ventas'
});

module.exports = pool.promise();