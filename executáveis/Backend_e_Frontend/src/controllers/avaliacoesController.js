const db = require('../config/db');

// ✅ CRIAR AVALIAÇÃO
exports.criar = (req, res) => {

  const { produto_id, usuario_id, estrelas, comentario } = req.body;

  if (!produto_id || !usuario_id || !estrelas) {
    return res.status(400).json({ erro: 'Dados obrigatórios faltando' });
  }

  if (estrelas < 1 || estrelas > 5) {
    return res.status(400).json({ erro: 'Nota deve ser entre 1 e 5' });
  }

  const sql = `
    INSERT INTO avaliacoes (produto_id, usuario_id, estrelas, comentario)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [produto_id, usuario_id, estrelas, comentario || null], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao salvar avaliação' });
    }

    res.json({ mensagem: 'Avaliação enviada com sucesso' });
  });
};


// ✅ LISTAR AVALIAÇÕES POR PRODUTO
exports.listarPorProduto = (req, res) => {
  const { produto_id } = req.params;

  const sql = `
    SELECT a.*, u.nome 
    FROM avaliacoes a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.produto_id = ?
    ORDER BY a.criado_em DESC
  `;

  db.query(sql, [produto_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar avaliações' });
    }

    res.json(results);
  });
};