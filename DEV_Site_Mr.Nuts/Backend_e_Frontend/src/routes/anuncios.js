const express = require('express');
const router = express.Router();
const controller = require('../controllers/anuncioController');
const upload = require('../config/upload');

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);
router.post('/', upload.single('imagem'), controller.criar);

module.exports = router;