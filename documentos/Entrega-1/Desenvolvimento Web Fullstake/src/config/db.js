const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // sua senha aqui
  database: 'marketplace_b2b'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

module.exports = connection;