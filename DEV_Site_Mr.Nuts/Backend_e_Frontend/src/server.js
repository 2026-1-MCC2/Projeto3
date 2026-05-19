const express = require('express');
const cors = require('cors');
const connection = require('./config/db');

const anunciosRoutes = require('./routes/anuncios');
const favoritosRoutes = require('./routes/favoritos');
const authRoutes = require('./routes/auth');
const avaliacoesRoutes = require('./routes/avaliacoes'); 

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/anuncios', anunciosRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/auth', authRoutes);
app.use('/avaliacoes', avaliacoesRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});