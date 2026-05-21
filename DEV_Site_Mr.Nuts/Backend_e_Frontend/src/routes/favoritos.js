const express = require('express');

const router = express.Router();

const db = require('../config/db');


// ============================================================
// FAVORITAR PRODUTO
// ============================================================

router.post('/produto', (req, res) => {

  const {
    usuario_id,
    produto_id
  } = req.body;

  if (!usuario_id || !produto_id) {

    return res.status(400).json({
      erro: 'Usuário e produto são obrigatórios'
    });

  }

  const sql = `
    INSERT IGNORE INTO favoritos
    (
      usuario_id,
      produto_id
    )
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [
      usuario_id,
      produto_id
    ],
    (err, result) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          erro: 'Erro ao favoritar produto'
        });

      }

      if (result.affectedRows === 0) {

        return res.json({
          mensagem: 'Produto já está nos favoritos',
          favoritado: true
        });

      }

      return res.json({
        mensagem: 'Produto favoritado com sucesso',
        favoritado: true
      });

    }
  );

});


// ============================================================
// LISTAR IDS DOS PRODUTOS FAVORITOS
// ============================================================

router.get('/produtos-ids/:usuarioId', (req, res) => {

  const { usuarioId } = req.params;

  const sql = `
    SELECT produto_id
    FROM favoritos
    WHERE usuario_id = ?
  `;

  db.query(sql, [usuarioId], (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: 'Erro ao listar favoritos'
      });

    }

    const ids = results.map(
      (item) => item.produto_id
    );

    return res.json(ids);

  });

});


// ============================================================
// LISTAR PRODUTOS FAVORITOS DO USUÁRIO
// ============================================================

router.get('/produtos/:usuarioId', (req, res) => {

  const { usuarioId } = req.params;

  const sql = `
    SELECT
      p.*,
      f.nome_empresa AS fornecedor_nome,
      c.nome AS categoria_nome
    FROM favoritos fav
    JOIN produtos p
      ON fav.produto_id = p.id
    LEFT JOIN fornecedores f
      ON p.fornecedor_id = f.id
    LEFT JOIN categorias c
      ON p.categoria_id = c.id
    WHERE fav.usuario_id = ?
    ORDER BY fav.criado_em DESC
  `;

  db.query(sql, [usuarioId], (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: 'Erro ao listar produtos favoritos'
      });

    }

    return res.json(results);

  });

});


// ============================================================
// REMOVER PRODUTO FAVORITO
// ============================================================

router.delete('/produto/:usuarioId/:produtoId', (req, res) => {

  const {
    usuarioId,
    produtoId
  } = req.params;

  const sql = `
    DELETE FROM favoritos
    WHERE usuario_id = ?
    AND produto_id = ?
  `;

  db.query(
    sql,
    [
      usuarioId,
      produtoId
    ],
    (err) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          erro: 'Erro ao remover produto favorito'
        });

      }

      return res.json({
        mensagem: 'Produto removido dos favoritos',
        favoritado: false
      });

    }
  );

});


// ============================================================
// FAVORITAR FORNECEDOR
// ============================================================

router.post('/fornecedor', (req, res) => {

  const {
    usuario_id,
    fornecedor_id
  } = req.body;

  if (!usuario_id || !fornecedor_id) {

    return res.status(400).json({
      erro: 'Usuário e fornecedor são obrigatórios'
    });

  }

  const sql = `
    INSERT IGNORE INTO favoritos_fornecedores
    (
      usuario_id,
      fornecedor_id
    )
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [
      usuario_id,
      fornecedor_id
    ],
    (err, result) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          erro: 'Erro ao favoritar fornecedor'
        });

      }

      if (result.affectedRows === 0) {

        return res.json({
          mensagem: 'Fornecedor já está nos favoritos',
          favoritado: true
        });

      }

      return res.json({
        mensagem: 'Fornecedor favoritado com sucesso',
        favoritado: true
      });

    }
  );

});


// ============================================================
// LISTAR FORNECEDORES FAVORITOS DO USUÁRIO
// ============================================================

router.get('/fornecedores/:usuarioId', (req, res) => {

  const { usuarioId } = req.params;

  const sql = `
    SELECT
      f.*
    FROM favoritos_fornecedores fav
    JOIN fornecedores f
      ON fav.fornecedor_id = f.id
    WHERE fav.usuario_id = ?
    ORDER BY fav.criado_em DESC
  `;

  db.query(sql, [usuarioId], (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: 'Erro ao listar fornecedores favoritos'
      });

    }

    return res.json(results);

  });

});


// ============================================================
// REMOVER FORNECEDOR FAVORITO
// ============================================================

router.delete('/fornecedor/:usuarioId/:fornecedorId', (req, res) => {

  const {
    usuarioId,
    fornecedorId
  } = req.params;

  const sql = `
    DELETE FROM favoritos_fornecedores
    WHERE usuario_id = ?
    AND fornecedor_id = ?
  `;

  db.query(
    sql,
    [
      usuarioId,
      fornecedorId
    ],
    (err) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          erro: 'Erro ao remover fornecedor favorito'
        });

      }

      return res.json({
        mensagem: 'Fornecedor removido dos favoritos',
        favoritado: false
      });

    }
  );

});


module.exports = router;