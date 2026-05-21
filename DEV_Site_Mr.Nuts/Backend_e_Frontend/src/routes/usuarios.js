const express = require('express')
const router = express.Router()
const connection = require('../config/db')


// ✅ LISTAR USUÁRIOS
router.get('/', (req, res) => {

  connection.query(
    'SELECT id, nome, email, role FROM usuarios',
    (err, results) => {

      if (err) {
        console.error(err)
        return res.status(500).json({
          erro: 'Erro ao buscar usuários'
        })
      }

      res.json(results)
    }
  )
})


// ✅ EXCLUIR USUÁRIO
router.delete('/:id', (req, res) => {

  const { id } = req.params

  connection.query(
    'DELETE FROM usuarios WHERE id = ?',
    [id],
    (err) => {

      if (err) {
        console.error('ERRO AO DELETAR:', err)
        return res.status(500).json({
          erro: 'Erro ao excluir usuário'
        })
      }

      res.json({
        mensagem: 'Usuário excluído com sucesso'
      })
    }
  )
})


module.exports = router