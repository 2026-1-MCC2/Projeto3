const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const anunciosRoutes = require('./routes/anuncios');
app.use('/anuncios', anunciosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});