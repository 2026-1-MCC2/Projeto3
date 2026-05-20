const express = require('express');
const router = express.Router();
const controller = require('../controllers/avaliacoesController');

// criar avaliação
router.post('/', controller.criar);

// listar avaliações de um produto
router.get('/produto/:produto_id', controller.listarPorProduto);

module.exports = router;
