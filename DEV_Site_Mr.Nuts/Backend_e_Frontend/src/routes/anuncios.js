const express = require('express');
const router = express.Router();
const controller = require('../controllers/anuncioController');
const upload = require('../uploads/upload');

// ✅ LISTAR TODOS OS PRODUTOS
router.get('/', controller.listar);

// ✅ LISTAR PRODUTOS POR FORNECEDOR (IMPORTANTE: vem antes do :id)
router.get('/fornecedor/:id', controller.listarPorFornecedor);

// ✅ BUSCAR PRODUTO POR ID
router.get('/:id', controller.buscarPorId);

// ✅ CRIAR PRODUTO (COM IMAGEM)
router.post('/', controller.criar);

// ✅ ATUALIZAR PRODUTO
router.put('/:id', upload.single('imagem'), controller.atualizar);

// ✅ DELETAR PRODUTO
router.delete('/:id', controller.deletar);

module.exports = router;
