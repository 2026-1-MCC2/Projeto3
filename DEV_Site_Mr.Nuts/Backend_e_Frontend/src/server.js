// pré definição de senha 123456cd
const bcrypt = require('bcrypt');

bcrypt.hash('123456', 10).then(hash => {
  console.log(hash);
});



const cors = require('cors');
const express = require('express');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ROTAS
const anunciosRoutes = require('./routes/anuncios');
app.use('/anuncios', anunciosRoutes);

// ROTA DE LOGIN 
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVIDOR NOVO RODANDO🔥 na porta ${PORT}`);
});

