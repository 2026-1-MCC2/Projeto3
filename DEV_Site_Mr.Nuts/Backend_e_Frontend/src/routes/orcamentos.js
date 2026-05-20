const express = require('express')
const router = express.Router()
const connection = require('../config/db')

// ============================================================
// TESTE DA ROTA
// GET /orcamentos
// ============================================================

router.get('/', (req, res) => {
  res.json({
    mensagem: 'Rota de orçamentos funcionando'
  })
})

// ============================================================
// CLIENTE CRIA SOLICITAÇÃO DE ORÇAMENTO
// POST /orcamentos
// ============================================================

router.post('/', (req, res) => {
  const {
    produto_id,
    fornecedor_id,
    comprador_id,
    produto_nome,
    fornecedor_nome,
    empresa_nome,
    quantidade,
    necessidades,
    frequencia,
    prazo_desejado,
    regiao_entrega,
    observacoes_cliente
  } = req.body

  if (!comprador_id || !necessidades) {
    return res.status(400).json({
      erro: 'Cliente e necessidades são obrigatórios.'
    })
  }

  const sql = `
    INSERT INTO orcamentos (
      produto_id,
      fornecedor_id,
      comprador_id,
      produto_nome,
      fornecedor_nome,
      empresa_nome,
      quantidade,
      necessidades,
      frequencia,
      prazo_desejado,
      regiao_entrega,
      observacoes_cliente,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `

  connection.query(
    sql,
    [
      produto_id || null,
      fornecedor_id || null,
      comprador_id,
      produto_nome || null,
      fornecedor_nome || null,
      empresa_nome || null,
      quantidade || null,
      necessidades,
      frequencia || null,
      prazo_desejado || null,
      regiao_entrega || null,
      observacoes_cliente || null
    ],
    (err, result) => {
      if (err) {
        console.error('Erro ao criar orçamento:', err)

        return res.status(500).json({
          erro: 'Erro ao criar solicitação de orçamento.'
        })
      }

      return res.status(201).json({
        mensagem: 'Solicitação de orçamento enviada com sucesso!',
        orcamento_id: result.insertId
      })
    }
  )
})

// ============================================================
// FORNECEDOR LISTA ORÇAMENTOS RECEBIDOS
// GET /orcamentos/fornecedor/:fornecedorId
// ============================================================

router.get('/fornecedor/:fornecedorId', (req, res) => {
  const { fornecedorId } = req.params

  const sql = `
    SELECT 
      o.*,
      p.nome AS produto_nome_banco,
      p.descricao AS produto_descricao,
      p.preco AS produto_preco,
      u.nome AS comprador_nome,
      u.email AS comprador_email,
      f.nome_empresa AS fornecedor_empresa
    FROM orcamentos o
    LEFT JOIN produtos p ON o.produto_id = p.id
    LEFT JOIN usuarios u ON o.comprador_id = u.id
    LEFT JOIN fornecedores f ON o.fornecedor_id = f.id
    WHERE o.fornecedor_id = ?
    ORDER BY o.criado_em DESC
  `

  connection.query(sql, [fornecedorId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar orçamentos do fornecedor:', err)

      return res.status(500).json({
        erro: 'Erro ao buscar orçamentos.'
      })
    }

    return res.json(results)
  })
})

// ============================================================
// CLIENTE LISTA OS PRÓPRIOS ORÇAMENTOS
// GET /orcamentos/cliente/:compradorId
// ============================================================

router.get('/cliente/:compradorId', (req, res) => {
  const { compradorId } = req.params

  const sql = `
    SELECT 
      o.*,
      p.nome AS produto_nome_banco,
      p.descricao AS produto_descricao,
      p.preco AS produto_preco,
      f.nome_empresa AS fornecedor_empresa
    FROM orcamentos o
    LEFT JOIN produtos p ON o.produto_id = p.id
    LEFT JOIN fornecedores f ON o.fornecedor_id = f.id
    WHERE o.comprador_id = ?
    ORDER BY o.criado_em DESC
  `

  connection.query(sql, [compradorId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar orçamentos do cliente:', err)

      return res.status(500).json({
        erro: 'Erro ao buscar orçamentos.'
      })
    }

    return res.json(results)
  })
})

// ============================================================
// BUSCAR UM ORÇAMENTO ESPECÍFICO
// GET /orcamentos/:id
// ============================================================

router.get('/:id', (req, res) => {
  const { id } = req.params

  const sql = `
    SELECT 
      o.*,
      p.nome AS produto_nome_banco,
      p.descricao AS produto_descricao,
      p.preco AS produto_preco,
      u.nome AS comprador_nome,
      u.email AS comprador_email,
      f.nome_empresa AS fornecedor_empresa
    FROM orcamentos o
    LEFT JOIN produtos p ON o.produto_id = p.id
    LEFT JOIN usuarios u ON o.comprador_id = u.id
    LEFT JOIN fornecedores f ON o.fornecedor_id = f.id
    WHERE o.id = ?
    LIMIT 1
  `

  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar orçamento:', err)

      return res.status(500).json({
        erro: 'Erro ao buscar orçamento.'
      })
    }

    if (results.length === 0) {
      return res.status(404).json({
        erro: 'Orçamento não encontrado.'
      })
    }

    return res.json(results[0])
  })
})

// ============================================================
// FORNECEDOR ACEITA OU RECUSA ORÇAMENTO
// PATCH /orcamentos/:id/responder
// ============================================================

router.patch('/:id/responder', (req, res) => {
  const { id } = req.params

  const {
    status,
    resposta,
    observacoes_fornecedor
  } = req.body

  if (!['accepted', 'refused'].includes(status)) {
    return res.status(400).json({
      erro: 'Status inválido. Use accepted ou refused.'
    })
  }

  const sql = `
    UPDATE orcamentos
    SET 
      status = ?,
      resposta = ?,
      observacoes_fornecedor = ?,
      respondido_em = NOW()
    WHERE id = ?
  `

  connection.query(
    sql,
    [
      status,
      resposta || null,
      observacoes_fornecedor || null,
      id
    ],
    (err, result) => {
      if (err) {
        console.error('Erro ao responder orçamento:', err)

        return res.status(500).json({
          erro: 'Erro ao responder orçamento.'
        })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          erro: 'Orçamento não encontrado.'
        })
      }

      return res.json({
        mensagem:
          status === 'accepted'
            ? 'Orçamento aceito com sucesso!'
            : 'Orçamento recusado com sucesso!'
      })
    }
  )
})

// ============================================================
// CLIENTE CANCELA ORÇAMENTO
// PATCH /orcamentos/:id/cancelar
// ============================================================

router.patch('/:id/cancelar', (req, res) => {
  const { id } = req.params

  const sql = `
    UPDATE orcamentos
    SET status = 'cancelled'
    WHERE id = ?
  `

  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao cancelar orçamento:', err)

      return res.status(500).json({
        erro: 'Erro ao cancelar orçamento.'
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Orçamento não encontrado.'
      })
    }

    return res.json({
      mensagem: 'Orçamento cancelado com sucesso!'
    })
  })
})

module.exports = router