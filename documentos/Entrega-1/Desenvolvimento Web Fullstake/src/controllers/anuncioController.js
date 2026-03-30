const db = require('../config/db');

// Listar todos
exports.listar = (req, res) => {
  db.query('SELECT * FROM anuncios', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    res.json(results);
  });
};

// Buscar um por ID
exports.buscarPorId = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM anuncios WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (results.length === 0) return res.status(404).json({ erro: 'Anúncio não encontrado' });
    res.json(results[0]);
  });
};

// Criar
exports.criar = (req, res) => {
  const { titulo, descricao, categoria, marca, moq, regiao, status } = req.body;
  if (!titulo || !descricao || !categoria || !marca || !moq || !regiao) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
  }
  const sql = 'INSERT INTO anuncios (titulo, descricao, categoria, marca, moq, regiao, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [titulo, descricao, categoria, marca, moq, regiao, status || 'rascunho'], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    res.status(201).json({ mensagem: 'Anúncio criado!', id: result.insertId });
  });
};

// Atualizar
exports.atualizar = (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, categoria, marca, moq, regiao, status } = req.body;
  const sql = 'UPDATE anuncios SET titulo=?, descricao=?, categoria=?, marca=?, moq=?, regiao=?, status=? WHERE id=?';
  db.query(sql, [titulo, descricao, categoria, marca, moq, regiao, status, id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Anúncio não encontrado' });
    res.json({ mensagem: 'Anúncio atualizado!' });
  });
};

// Deletar
exports.deletar = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM anuncios WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Anúncio não encontrado' });
    res.json({ mensagem: 'Anúncio deletado!' });
  });
};