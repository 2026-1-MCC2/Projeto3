const express = require('express')
const router = express.Router()
const connection = require('../config/db')


// ============================================================
// LISTAR TODOS OS ORÇAMENTOS
// ============================================================

router.get('/', (req, res) => {

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
    ORDER BY o.criado_em DESC
  `

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao listar orçamentos:', err)
      return res.status(500).json({ erro: 'Erro ao listar orçamentos.' })
    }

    res.json(results)
  })
})


// ============================================================
// CRIAR ORÇAMENTO
// ============================================================

router.post('/', (req, res) => {

  let {
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
    regiao_entrega
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
      status,
      criado_em,
      atualizado_em
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
  `

  connection.query(
    sql,
    [
      Number(produto_id) || null,
      Number(fornecedor_id) || null,
      Number(comprador_id),
      produto_nome || null,
      fornecedor_nome || null,
      empresa_nome || null,
      quantidade || null,
      necessidades || null,
      frequencia || null,
      prazo_desejado || null,
      regiao_entrega || null
    ],
    (err, result) => {

      if (err) {

        console.error('💥 ERRO SQL AO CRIAR ORÇAMENTO:', err)

        return res.status(500).json({
          erro: err.sqlMessage || 'Erro ao criar orçamento.'
        })
      }

      res.status(201).json({
        mensagem: 'Solicitação de orçamento enviada com sucesso!',
        orcamento_id: result.insertId
      })
    }
  )
})


// ============================================================
// ORÇAMENTOS DO FORNECEDOR
// ============================================================

router.get('/fornecedor/:fornecedorId', (req, res) => {

  const { fornecedorId } = req.params

  const sql = `
    SELECT 
      o.*,
      p.nome AS produto_nome_banco,
      u.nome AS comprador_nome,
      u.email AS comprador_email,
      f.nome_empresa AS fornecedor_empresa
    FROM orcamentos o
    LEFT JOIN produtos p ON o.produto_id = p.id
    LEFT JOIN usuarios u ON o.comprador_id = u.id
    LEFT JOIN fornecedores f ON o.fornecedor_id = f.id
    WHERE o.fornecedor_id = ?
       OR f.usuario_id = ?
    ORDER BY o.criado_em DESC
  `

  connection.query(sql, [fornecedorId, fornecedorId], (err, results) => {

    if (err) {
      console.error('Erro ao buscar orçamentos do fornecedor:', err)
      return res.status(500).json({ erro: 'Erro ao buscar orçamentos.' })
    }

    res.json(results)
  })
})


// ============================================================
// ORÇAMENTOS DO CLIENTE
// ============================================================

router.get('/cliente/:compradorId', (req, res) => {

  const { compradorId } = req.params

  const sql = `
    SELECT 
      o.*,
      p.nome AS produto_nome_banco,
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
      return res.status(500).json({ erro: 'Erro ao buscar orçamentos.' })
    }

    res.json(results)
  })
})


// ============================================================
// RESPONDER ORÇAMENTO
// ============================================================

router.patch('/:id/responder', (req, res) => {

  const { id } = req.params
  const { resposta } = req.body

  if (!resposta) {
    return res.status(400).json({ erro: 'Resposta obrigatória.' })
  }

  const sql = `
    UPDATE orcamentos
    SET 
      status = 'responded',
      resposta = ?,
      respondido_em = NOW()
    WHERE id = ?
  `

  connection.query(sql, [resposta, id], (err, result) => {

    if (err) {
      console.error('Erro ao responder orçamento:', err)
      return res.status(500).json({ erro: 'Erro ao responder.' })
    }

    res.json({ mensagem: 'Orçamento respondido com sucesso!' })
  })
})


// ============================================================
// FECHAR ORÇAMENTO
// ============================================================

router.patch('/:id/fechar', (req, res) => {

  const { id } = req.params

  connection.query(
    `UPDATE orcamentos SET status = 'closed' WHERE id = ?`,
    [id],
    (err) => {

      if (err) {
        console.error('Erro ao fechar:', err)
        return res.status(500).json({ erro: 'Erro ao fechar.' })
      }

      res.json({ mensagem: 'Orçamento fechado!' })
    }
  )
})


// ============================================================
// CANCELAR ORÇAMENTO
// ============================================================

router.patch('/:id/cancelar', (req, res) => {

  const { id } = req.params

  connection.query(
    `UPDATE orcamentos SET status = 'cancelled' WHERE id = ?`,
    [id],
    (err) => {

      if (err) {
        console.error('Erro ao cancelar:', err)
        return res.status(500).json({ erro: 'Erro ao cancelar.' })
      }

      res.json({ mensagem: 'Orçamento cancelado!' })
    }
  )
})


module.exports = router