const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { dataInicio, dataFim, status } = req.query;

    const filtrosPeriodo = [];
    const paramsPeriodo = [];

    if (dataInicio && dataFim) {
      filtrosPeriodo.push('criado_em BETWEEN ? AND ?');
      paramsPeriodo.push(`${dataInicio} 00:00:00`, `${dataFim} 23:59:59`);
    }

    const wherePeriodo = filtrosPeriodo.length
      ? `WHERE ${filtrosPeriodo.join(' AND ')}`
      : '';

    const filtrosProdutos = [];
    const paramsProdutos = [];

    if (dataInicio && dataFim) {
      filtrosProdutos.push('criado_em BETWEEN ? AND ?');
      paramsProdutos.push(`${dataInicio} 00:00:00`, `${dataFim} 23:59:59`);
    }

    if (status) {
      filtrosProdutos.push('status = ?');
      paramsProdutos.push(status);
    }

    const whereProdutos = filtrosProdutos.length
      ? `WHERE ${filtrosProdutos.join(' AND ')}`
      : '';

    const [usuarios] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM usuarios ${wherePeriodo}`,
      paramsPeriodo
    );

    const [produtos] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM produtos ${whereProdutos}`,
      paramsProdutos
    );

    const [fornecedores] = await db.promise().query(
      'SELECT COUNT(*) AS total FROM fornecedores'
    );

    const [avaliacoes] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM avaliacoes ${wherePeriodo}`,
      paramsPeriodo
    );

    const [orcamentos] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM orcamentos ${wherePeriodo}`,
      paramsPeriodo
    );

    const [statusAnuncios] = await db.promise().query(
      `
      SELECT status, COUNT(*) AS total
      FROM produtos
      ${dataInicio && dataFim ? 'WHERE criado_em BETWEEN ? AND ?' : ''}
      GROUP BY status
      `,
      dataInicio && dataFim
        ? [`${dataInicio} 00:00:00`, `${dataFim} 23:59:59`]
        : []
    );

    const [rankingFornecedores] = await db.promise().query(
      `
      SELECT
        f.id AS fornecedor_id,
        f.nome_empresa,
        ROUND(AVG(a.estrelas), 1) AS media_avaliacao,
        COUNT(a.id) AS total_avaliacoes
      FROM fornecedores f
      JOIN produtos p ON p.fornecedor_id = f.id
      JOIN avaliacoes a ON a.produto_id = p.id
      ${
        dataInicio && dataFim
          ? 'WHERE a.criado_em BETWEEN ? AND ?'
          : ''
      }
      GROUP BY f.id, f.nome_empresa
      ORDER BY media_avaliacao DESC, total_avaliacoes DESC
      LIMIT 10
      `,
      dataInicio && dataFim
        ? [`${dataInicio} 00:00:00`, `${dataFim} 23:59:59`]
        : []
    );

    const [produtosRecentes] = await db.promise().query(
      `
      SELECT
        p.id,
        p.nome,
        p.status,
        p.preco,
        p.criado_em,
        f.nome_empresa
      FROM produtos p
      LEFT JOIN fornecedores f ON f.id = p.fornecedor_id
      ORDER BY p.criado_em DESC
      LIMIT 5
      `
    );

    const [avaliacoesRecentes] = await db.promise().query(
      `
      SELECT
        a.id,
        a.estrelas,
        a.comentario,
        a.criado_em,
        u.nome AS usuario_nome,
        p.nome AS produto_nome
      FROM avaliacoes a
      LEFT JOIN usuarios u ON u.id = a.usuario_id
      LEFT JOIN produtos p ON p.id = a.produto_id
      ORDER BY a.criado_em DESC
      LIMIT 5
      `
    );

    const statusFormatado = {
      active: 0,
      pending: 0,
      paused: 0,
      draft: 0
    };

    statusAnuncios.forEach((item) => {
      statusFormatado[item.status] = item.total;
    });

    res.json({
      filtros: {
        dataInicio: dataInicio || null,
        dataFim: dataFim || null,
        status: status || null
      },
      totais: {
        usuarios: usuarios[0].total,
        produtos: produtos[0].total,
        fornecedores: fornecedores[0].total,
        avaliacoes: avaliacoes[0].total,
        orcamentos: orcamentos[0].total
      },
      statusAnuncios: statusFormatado,
      rankingFornecedores,
      produtosRecentes,
      avaliacoesRecentes
    });

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).json({ erro: 'Erro ao carregar dashboard' });
  }
});

module.exports = router;