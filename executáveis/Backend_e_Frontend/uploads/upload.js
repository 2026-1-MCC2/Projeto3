const multer = require('multer');
const path = require('path');


// ✅ CONFIGURAÇÃO DE ARMAZENAMENTO

const storage = multer.diskStorage({

  // ✅ PASTA DESTINO

  destination: (req, file, cb) => {

    cb(null, 'uploads/');

  },

  // ✅ NOME DO ARQUIVO

  filename: (req, file, cb) => {

    const nomeArquivo =
      Date.now() +
      path.extname(file.originalname);

    cb(null, nomeArquivo);

  }

});


// ✅ EXPORTAR MULTER

module.exports = multer({
  storage
});