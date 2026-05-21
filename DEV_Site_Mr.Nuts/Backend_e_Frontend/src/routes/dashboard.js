const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {

  try {
    const [usuarios] = await db.promise().query('SELECT COUNT(*) as total FROM usuarios');
    const [produtos] = await db.promise().query('SELECT COUNT(*) as total FROM produtos');
    const [fornecedores] = await db.promise().query('SELECT COUNT(*) as total FROM fornecedores');
    const [avaliacoes] = await db.promise().query('SELECT COUNT(*) as total FROM avaliacoes');
    const [orcamentos] = await db.promise().query('SELECT COUNT(*) as total FROM orcamentos');

    res.json({
      usuarios: usuarios[0].total,
      produtos: produtos[0].total,
      fornecedores: fornecedores[0].total,
      avaliacoes: avaliacoes[0].total,
      orcamentos: orcamentos[0].total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dashboard' });
  }

});

module.exports = router;