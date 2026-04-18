const db = require('../config/db');
const imagem = req.file ? req.file.path : null;

// LISTAR TODOS OS PRODUTOS
exports.listar = (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    res.json(results);
  });
};

// BUSCAR POR ID
exports.buscarPorId = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM produtos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (results.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });

    res.json(results[0]);
  });
};

// CRIAR PRODUTO
exports.criar = (req, res) => {
  const {
    nome,
    descricao,
    marca,
    moq,
    unidade,
    regiao,
    prazo_entrega,
    status,
    fornecedor_id,
    categoria_id,
    imagem
  } = req.body;

  if (!nome || !descricao || !fornecedor_id || !categoria_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
  }

  const sql = `
    INSERT INTO produtos 
    (nome, descricao, marca, moq, unidade, regiao, prazo_entrega, status, fornecedor_id, categoria_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nome, descricao, marca, moq, unidade, regiao, prazo_entrega, status || 'pending', fornecedor_id, categoria_id,imagem],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err });

      res.status(201).json({
        mensagem: 'Produto criado!',
        id: result.insertId
      });
    }
  );
};

// ATUALIZAR PRODUTO
exports.atualizar = (req, res) => {
  const { id } = req.params;

  const {
    nome,
    descricao,
    marca,
    moq,
    unidade,
    regiao,
    prazo_entrega,
    status
  } = req.body;

  const sql = `
    UPDATE produtos 
    SET nome=?, descricao=?, marca=?, moq=?, unidade=?, regiao=?, prazo_entrega=?, status=?
    WHERE id=?
  `;

  db.query(
    sql,
    [nome, descricao, marca, moq, unidade, regiao, prazo_entrega, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ erro: 'Produto não encontrado' });

      res.json({ mensagem: 'Produto atualizado!' });
    }
  );
};

// DELETAR PRODUTO
exports.deletar = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM produtos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Produto não encontrado' });

    res.json({ mensagem: 'Produto deletado!' });
  });
};