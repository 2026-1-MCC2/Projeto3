
const express = require('express');
const router = express.Router();
const controller = require('../controllers/anuncioController');
const upload = require('../../../uploads/upload');

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', upload.single('imagem'), controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

module.exports = router;
