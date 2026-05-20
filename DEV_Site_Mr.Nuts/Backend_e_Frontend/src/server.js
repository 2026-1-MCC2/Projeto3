const express = require('express');
const cors = require('cors');
const connection = require('./config/db');

const anunciosRoutes = require('./routes/anuncios');
const favoritosRoutes = require('./routes/favoritos');
const authRoutes = require('./routes/auth');
const avaliacoesRoutes = require('./routes/avaliacoes');
const orcamentosRoutes = require('./routes/orcamentos');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/anuncios', anunciosRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/auth', authRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/orcamentos', orcamentosRoutes);

app.get('/teste-orcamentos', (req, res) => {
  res.json({
    mensagem: 'Servidor certo está rodando'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});