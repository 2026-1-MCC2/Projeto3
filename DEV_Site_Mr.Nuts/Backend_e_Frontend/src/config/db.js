require('dotenv').config();

// Verificação das variáveis de ambiente
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'PORT'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
  console.error(`⚠️ Variáveis ausentes no .env: ${missingEnv.join(', ')}`);
  console.error('Verifique se o arquivo .env está configurado corretamente.');
  process.exit(1); // encerra o servidor para evitar erros de conexão
}


const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

module.exports = connection;