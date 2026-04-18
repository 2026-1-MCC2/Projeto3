const cors = require('cors');
const express = require('express');
require('dotenv').config();

const app = express();

app.use(cors()); // 👈 FALTAVA ISSO
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const anunciosRoutes = require('./routes/anuncios');
app.use('/anuncios', anunciosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVIDOR NOVO RODANDO🔥 na porta ${PORT}`);
});