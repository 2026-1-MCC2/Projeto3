const express = require('express');

const router = express.Router();

const controller =
  require('../controllers/avaliacoesController');

const db = require('../config/db');


// ============================================================
// CRIAR AVALIAÇÃO
// ============================================================

router.post(
  '/',
  controller.criar
);


// ============================================================
// LISTAR AVALIAÇÕES DE UM PRODUTO
// ============================================================

router.get(
  '/produto/:produto_id',
  controller.listarPorProduto
);


// ============================================================
// LISTAR TODAS AS AVALIAÇÕES
// ADMIN
// ============================================================

router.get('/', (req, res) => {

  const sql = `
    SELECT
      a.*,
      u.nome AS usuario_nome,
      p.nome AS produto_nome
    FROM avaliacoes a
    LEFT JOIN usuarios u
      ON a.usuario_id = u.id
    LEFT JOIN produtos p
      ON a.produto_id = p.id
    ORDER BY a.criado_em DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro:
          'Erro ao listar avaliações'
      });

    }

    return res.json(results);

  });

});


// ============================================================
// OCULTAR AVALIAÇÃO
// ============================================================

router.put('/ocultar/:id', (req, res) => {

  const { id } = req.params;

  const sql = `
    UPDATE avaliacoes
    SET visivel = FALSE
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro:
          'Erro ao ocultar avaliação'
      });

    }

    return res.json({
      mensagem:
        'Avaliação ocultada'
    });

  });

});


// ============================================================
// REMOVER AVALIAÇÃO
// ============================================================

router.delete('/:id', (req, res) => {

  const { id } = req.params;

  const sql = `
    DELETE FROM avaliacoes
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro:
          'Erro ao remover avaliação'
      });

    }

    return res.json({
      mensagem:
        'Avaliação removida'
    });

  });

});


module.exports = router;