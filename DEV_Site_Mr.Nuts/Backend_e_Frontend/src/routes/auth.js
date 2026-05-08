const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');


// ✅ ROTA DE LOGIN
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Erro no SELECT:', err);
      return res.status(500).json({ erro: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];

    try {
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha inválida' });
      }

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
      console.error('Erro bcrypt:', error);
      return res.status(500).json({ erro: 'Erro ao verificar senha' });
    }
  });
});


// ✅ ✅ ROTA: ATUALIZAR USUÁRIO
router.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  // validação básica
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }

  try {
    let senha_hash = null;

    // criptografa se veio senha nova
    if (senha && senha.trim() !== '') {
      senha_hash = await bcrypt.hash(senha, 10);
    }

    let sql;
    let params;

    if (senha_hash) {
      sql = 'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?';
      params = [nome, email, senha_hash, id];
    } else {
      sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
      params = [nome, email, id];
    }

    db.query(sql, params, (err, result) => {

      if (err) {
        console.error('Erro no UPDATE:', err); // 🔥 AGORA MOSTRA ERRO REAL
        return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
      }

      // verifica se alterou algum registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado para atualizar' });
      }

      return res.json({ mensagem: 'Usuário atualizado com sucesso' });

    });

  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ erro: 'Erro no servidor' });
  }
});

module.exports = router;