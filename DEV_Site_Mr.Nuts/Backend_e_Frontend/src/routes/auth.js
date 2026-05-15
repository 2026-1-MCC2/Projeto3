const express = require('express');

const router = express.Router();

const db = require('../config/db');

const bcrypt = require('bcrypt');

const crypto = require('crypto');


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

      console.error(
        'ERRO LOGIN:',
        err
      );

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

      // VALIDAR SENHA

      const senhaValida =
        await bcrypt.compare(
          senha,
          usuario.senha_hash
        );

      if (!senhaValida) {

        return res.status(401).json({
          erro: 'Senha inválida'
        });

      }

      // USUÁRIO PENDENTE

      if (usuario.status === 'pendente') {

        return res.status(403).json({
          erro:
            'Cadastro aguardando aprovação do administrador'
        });

      }

      // USUÁRIO BLOQUEADO

      if (usuario.status === 'bloqueado') {

        return res.status(403).json({
          erro:
            'Usuário bloqueado'
        });

      }

      // LOGIN OK

      return res.status(200).json({

        mensagem:
          'Login realizado com sucesso',

        usuario: {

          id: usuario.id,

          nome: usuario.nome,

          email: usuario.email,

          role: usuario.role,

          status: usuario.status

        }

      });

    } catch (error) {

      console.error(
        'ERRO BCRYPT:',
        error
      );

      return res.status(500).json({
        erro: 'Erro ao validar senha'
      });

    }

  });

});


// ============================================================
// CADASTRO
// ============================================================

router.post('/register', async (req, res) => {

  const {
    nome,
    email,
    senha,
    role
  } = req.body;

  // VALIDAÇÃO

  if (!nome || !email || !senha || !role) {

    return res.status(400).json({
      erro: 'Preencha todos os campos'
    });

  }

  try {

    // VERIFICAR EMAIL

    const verificarSql = `
      SELECT id
      FROM usuarios
      WHERE email = ?
    `;

    db.query(
      verificarSql,
      [email],
      async (err, results) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            erro: 'Erro no servidor'
          });

        }

        // EMAIL JÁ EXISTE

        if (results.length > 0) {

          return res.status(400).json({
            erro: 'Email já cadastrado'
          });

        }

        // HASH SENHA

        const senha_hash =
          await bcrypt.hash(senha, 10);

        // STATUS

        let status = 'ativo';

        // FORNECEDOR PRECISA APROVAÇÃO

        if (role === 'supplier') {

          status = 'pendente';

        }

        // INSERT

        const sql = `
          INSERT INTO usuarios
          (
            nome,
            email,
            senha_hash,
            role,
            status
          )
          VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
          nome,
          email,
          senha_hash,
          role,
          status
        ];

        db.query(
          sql,
          values,
          (err, result) => {

            if (err) {

              console.error(err);

              return res.status(500).json({
                erro:
                  'Erro ao cadastrar usuário'
              });

            }

            return res.status(201).json({

              mensagem:

                role === 'supplier'

                  ? 'Cadastro enviado para aprovação do administrador'

                  : 'Cadastro realizado com sucesso'

            });

          }
        );

      }
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      erro: 'Erro interno'
    });

  }

});


// ============================================================
// LISTAR FORNECEDORES PENDENTES
// ============================================================

router.get('/pendentes', (req, res) => {

  const sql = `
    SELECT
      id,
      nome,
      email,
      role,
      status
    FROM usuarios
    WHERE
      role = 'supplier'
      AND status = 'pendente'
  `;

  db.query(sql, (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro:
          'Erro ao buscar pendentes'
      });

    }

    return res.json(results);

  });

});


// ============================================================
// APROVAR FORNECEDOR
// ============================================================

router.put('/aprovar/:id', (req, res) => {

  const { id } = req.params;

  const sql = `
    UPDATE usuarios
    SET status = 'ativo'
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro:
          'Erro ao aprovar fornecedor'
      });

    }

    return res.json({
      mensagem:
        'Fornecedor aprovado com sucesso'
    });

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
      erro:
        'Nome e email são obrigatórios'
    });

  }

  try {

    let sql = '';

    let params = [];

    // COM NOVA SENHA

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

    // SEM ALTERAR SENHA

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

    // UPDATE

    db.query(sql, params, (err, result) => {

      if (err) {

        console.error(
          'ERRO UPDATE:',
          err
        );

        return res.status(500).json({
          erro:
            'Erro ao atualizar usuário'
        });

      }

      if (result.affectedRows === 0) {

        return res.status(404).json({
          erro:
            'Usuário não encontrado'
        });

      }

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
      erro:
        'Erro interno do servidor'
    });

  }

});

// ============================================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// ============================================================

router.post('/forgot-password', (req, res) => {

  const { email } = req.body;

  if (!email) {

    return res.status(400).json({
      erro: 'Informe o e-mail'
    });

  }

  const buscarUsuarioSql = `
    SELECT id, email
    FROM usuarios
    WHERE email = ?
  `;

  db.query(buscarUsuarioSql, [email], (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: 'Erro no servidor'
      });

    }

    if (results.length === 0) {

      return res.status(404).json({
        erro: 'E-mail não encontrado'
      });

    }

    const usuario = results[0];

    const token = crypto.randomBytes(32).toString('hex');

    const expira = new Date(Date.now() + 1000 * 60 * 30);

    const salvarTokenSql = `
      UPDATE usuarios
      SET
        reset_token = ?,
        reset_expira = ?
      WHERE id = ?
    `;

    db.query(
      salvarTokenSql,
      [token, expira, usuario.id],
      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            erro: 'Erro ao gerar recuperação'
          });

        }

        const linkRecuperacao =
          `http://localhost:5173/reset-password/${token}`;

        console.log(
          'LINK DE RECUPERAÇÃO:',
          linkRecuperacao
        );

        return res.json({
          mensagem:
            'Link de recuperação gerado com sucesso',
          link: linkRecuperacao
        });

      }
    );

  });

});

// ============================================================
// REDEFINIR SENHA
// ============================================================

router.post('/reset-password/:token', async (req, res) => {

  const { token } = req.params;

  const { novaSenha } = req.body;

  if (!novaSenha) {

    return res.status(400).json({
      erro: 'Informe a nova senha'
    });

  }

  const buscarTokenSql = `
    SELECT id, reset_expira
    FROM usuarios
    WHERE reset_token = ?
  `;

  db.query(buscarTokenSql, [token], async (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: 'Erro no servidor'
      });

    }

    if (results.length === 0) {

      return res.status(400).json({
        erro: 'Token inválido'
      });

    }

    const usuario = results[0];

    const agora = new Date();

    const expiracao = new Date(usuario.reset_expira);

    if (agora > expiracao) {

      return res.status(400).json({
        erro: 'Token expirado'
      });

    }

    const senha_hash =
      await bcrypt.hash(novaSenha, 10);

    const atualizarSenhaSql = `
      UPDATE usuarios
      SET
        senha_hash = ?,
        reset_token = NULL,
        reset_expira = NULL
      WHERE id = ?
    `;

    db.query(
      atualizarSenhaSql,
      [senha_hash, usuario.id],
      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            erro: 'Erro ao atualizar senha'
          });

        }

        return res.json({
          mensagem: 'Senha redefinida com sucesso'
        });

      }
    );

  });

});


module.exports = router;