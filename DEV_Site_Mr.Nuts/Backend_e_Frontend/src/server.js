// ✅ CONEXÃO COM BANCO

const connection = require('./config/db');


// ✅ DEPENDÊNCIAS

const cors = require('cors');
const express = require('express');


// ✅ APP

const app = express();


// ✅ MIDDLEWARES

app.use(cors());

app.use(express.json());


// ✅ SERVIR IMAGENS

app.use(
  '/uploads',
  express.static('uploads')
);


// ✅ ROTAS DE PRODUTOS

const anunciosRoutes = require('./routes/anuncios');

app.use(
  '/anuncios',
  anunciosRoutes
);


// ✅ ROTAS DE AUTH

const authRoutes = require('./routes/auth');

app.use(
  '/auth',
  authRoutes
);


// ✅ SERVIDOR

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `SERVIDOR RODANDO 🔥 na porta ${PORT}`
  );

});