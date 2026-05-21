require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connection = require('./config/db');

const anunciosRoutes =
  require('./routes/anuncios');

const favoritosRoutes =
  require('./routes/favoritos');

const authRoutes =
  require('./routes/auth');

const avaliacoesRoutes =
  require('./routes/avaliacoes');

const orcamentosRoutes =
  require('./routes/orcamentos');

const app = express();

const dashboardRoutes = 
  require('./routes/dashboard');


// ============================================================
// CORS
// ============================================================

app.use(cors({

  origin: function (origin, callback) {

    if (
      !origin ||
      origin.startsWith('http://localhost:')
    ) {

      callback(null, true);

    } else {

      callback(
        new Error(
          'Origem não permitida pelo CORS'
        )
      );

    }

  },

  credentials: true

}));


// ============================================================
// JSON
// ============================================================

app.use(express.json());


// ============================================================
// PASTA UPLOADS
// ============================================================

app.use(
  '/uploads',
  express.static('uploads')
);


// ============================================================
// ROTAS
// ============================================================

// ANÚNCIOS

app.use(
  '/anuncios',
  anunciosRoutes
);


// FAVORITOS

app.use(
  '/favoritos',
  favoritosRoutes
);


// AUTH

app.use(
  '/auth',
  authRoutes
);


// AVALIAÇÕES

app.use(
  '/avaliacoes',
  avaliacoesRoutes
);


// ORÇAMENTOS

app.use(
  '/orcamentos',
  orcamentosRoutes
);


// ============================================================
// TESTE SERVIDOR
// ============================================================

app.get('/', (req, res) => {

  res.json({
    mensagem:
      'API Restocka funcionando ✅'
  });

});


// ============================================================
// TESTE ORÇAMENTOS
// ============================================================

app.get('/teste-orcamentos', (req, res) => {

  res.json({
    mensagem:
      'Servidor certo está rodando'
  });

});


// ============================================================
// PORTA
// ============================================================

const PORT =
  process.env.PORT || 3000;


// ============================================================
// START SERVIDOR
// ============================================================

app.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT}`
  );

});

// ============================================================
// DASHBOARD
// ============================================================
app.use('/dashboard', dashboardRoutes);