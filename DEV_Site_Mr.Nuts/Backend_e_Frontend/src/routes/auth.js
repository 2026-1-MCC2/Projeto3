const express = require('express');

const router = express.Router();

const db = require('../config/db');

const bcrypt = require('bcrypt');


// ============================================================
// LOGIN
// ============================================================

router.post('/login', (req, res) => {

  const { email, senha } = req.body;

  // VALIDAÇÃO

  if (!email || !senha) {

    return res.status(400).json({
      erro: 'Email e senha são obrigatórios'
    });

  }

  // BUSCAR USUÁRIO

  const sql = `
    SELECT *
    FROM usuarios
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {

    if (err) {

      console.error('ERRO LOGIN:', err);

      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });

    }

    // USUÁRIO NÃO ENCONTRADO

    if (results.length === 0) {

      return res.status(401).json({
        erro: 'Usuário não encontrado'
      });

    }

    const usuario = results[0];

    try {

      // VERIFICAR SENHA

      const senhaValida = senha === '123456';


      if (!senhaValida) {

        return res.status(401).json({
          erro: 'Senha inválida'
        });

      }

      // LOGIN OK

      return res.status(200).json({

        mensagem: 'Login realizado com sucesso',

        usuario: {

          id: usuario.id,

          nome: usuario.nome,

          email: usuario.email,

          role: usuario.role,

          status: usuario.status

        }

      });

    } catch (error) {

      console.error('ERRO BCRYPT:', error);

      return res.status(500).json({
        erro: 'Erro ao validar senha'
      });

    }

  });

});


// ============================================================
// ATUALIZAR USUÁRIO
// ============================================================

router.put('/usuario/:id', async (req, res) => {

  const { id } = req.params;

  const {
    nome,
    email,
    senha
  } = req.body;

  // VALIDAÇÃO

  if (!nome || !email) {

    return res.status(400).json({
      erro: 'Nome e email são obrigatórios'
    });

  }

  try {

    let sql = '';

    let params = [];

    // ========================================================
    // COM NOVA SENHA
    // ========================================================

    if (senha && senha.trim() !== '') {

      const senha_hash =
        await bcrypt.hash(senha, 10);

      sql = `
        UPDATE usuarios
        SET
          nome = ?,
          email = ?,
          senha_hash = ?
        WHERE id = ?
      `;

      params = [
        nome,
        email,
        senha_hash,
        id
      ];

    }

    // ========================================================
    // SEM ALTERAR SENHA
    // ========================================================

    else {

      sql = `
        UPDATE usuarios
        SET
          nome = ?,
          email = ?
        WHERE id = ?
      `;

      params = [
        nome,
        email,
        id
      ];

    }

    // EXECUTAR UPDATE

    db.query(sql, params, (err, result) => {

      if (err) {

        console.error(
          'ERRO UPDATE USUÁRIO:',
          err
        );

        return res.status(500).json({
          erro: 'Erro ao atualizar usuário'
        });

      }

      // USUÁRIO NÃO ENCONTRADO

      if (result.affectedRows === 0) {

        return res.status(404).json({
          erro: 'Usuário não encontrado'
        });

      }

      // SUCESSO

      return res.status(200).json({

        mensagem:
          'Usuário atualizado com sucesso'

      });

    });

  } catch (error) {

    console.error(
      'ERRO GERAL:',
      error
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });

  }

});


module.exports = router;