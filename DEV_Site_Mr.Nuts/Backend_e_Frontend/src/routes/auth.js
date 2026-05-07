const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
bcrypt.hash('123456', 10).then(hash => {
  console.log(hash);
});

// ROTA DE LOGIN
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verifica se enviou os dados
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro no servidor' });
    }

    // usuário não encontrado
    if (results.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];

    try {
      // compara senha com bcrypt
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha inválida' });
      }

      // login sucesso
      return res.json({
        mensagem: 'Login realizado com sucesso',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao verificar senha' });
    }
  });
});

module.exports = router;