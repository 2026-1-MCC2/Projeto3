const express = require('express');

const router = express.Router();

const db = require('../config/db');

const controller =
  require('../controllers/anuncioController');

const upload =
  require('../../uploads/upload');


// ============================================================
// LISTAR TODOS OS PRODUTOS
// ============================================================

router.get(
  '/',
  controller.listar
);


// ============================================================
// LISTAR ANÚNCIOS PENDENTES
// ============================================================

router.get(
  '/pendentes',
  controller.listarPendentes
);


// ============================================================
// APROVAR ANÚNCIO
// ============================================================

router.put(
  '/aprovar/:id',
  controller.aprovar
);


// ============================================================
// REPROVAR ANÚNCIO
// ============================================================

router.put(
  '/reprovar/:id',
  controller.reprovar
);


// ============================================================
// LISTAR PRODUTOS POR FORNECEDOR
// IMPORTANTE: vem antes do /:id
// ============================================================

router.get(
  '/fornecedor/:id',
  controller.listarPorFornecedor
);


// ============================================================
// BUSCAR PRODUTO POR ID
// ============================================================

router.get(
  '/:id',
  controller.buscarPorId
);


// ============================================================
// CRIAR PRODUTO COM IMAGEM
// ============================================================

router.post(
  '/',
  upload.single('imagem'),
  controller.criar
);


// ============================================================
// ATUALIZAR PRODUTO
// ============================================================

router.put(
  '/:id',
  upload.single('imagem'),
  controller.atualizar
);


// ============================================================
// DELETAR PRODUTO
// ============================================================

router.delete(
  '/:id',
  controller.deletar
);


// ============================================================
// RELATÓRIO - CADASTROS POR PERÍODO
// ============================================================

router.get(
  '/relatorio/cadastros',
  (req, res) => {

    const sql = `
      SELECT
        DATE(criado_em) AS data,
        COUNT(*) AS total
      FROM usuarios
      GROUP BY DATE(criado_em)
      ORDER BY data DESC
    `;

    db.query(sql, (err, result) => {

      if (err) {

        console.error(
          'ERRO RELATÓRIO:',
          err
        );

        return res.status(500).json({
          erro: 'Erro ao gerar relatório'
        });

      }

      res.json(result);

    });

  }
);


// ============================================================
// RELATÓRIO - ANÚNCIOS POR STATUS
// ============================================================

router.get(
  '/relatorio/anuncios-status',
  (req, res) => {

    const sql = `
      SELECT
        status,
        COUNT(*) AS total
      FROM produtos
      GROUP BY status
    `;

    db.query(sql, (err, result) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          erro: 'Erro ao gerar relatório'
        });

      }

      res.json(result);

    });

  }
);


// ============================================================
// RELATÓRIO - MÉDIA DE AVALIAÇÃO
// ============================================================

router.get(
  '/relatorio/avaliacoes',
  (req, res) => {

    const sql = `
      SELECT
        produto_id,
        AVG(estrelas) AS media
      FROM avaliacoes
      GROUP BY produto_id
    `;

    db.query(sql, (err, result) => {

      if (err) {

        console.error(
          'ERRO AVALIAÇÕES:',
          err
        );

        return res.status(500).json({
          erro: 'Erro ao gerar relatório'
        });

      }

      res.json(result);

    });

  }
);


module.exports = router;