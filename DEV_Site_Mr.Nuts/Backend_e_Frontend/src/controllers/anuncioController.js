const db = require('../config/db');


// ✅ LISTAR TODOS OS PRODUTOS
exports.listar = (req, res) => {
  const sql = `
    SELECT p.*, u.nome AS fornecedor_nome
    FROM produtos p
    LEFT JOIN usuarios u ON p.fornecedor_id = u.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar produtos' });
    }

    res.json(results);
  });
};


// ✅ LISTAR PRODUTOS DO FORNECEDOR
exports.listarPorFornecedor = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT * FROM produtos WHERE fornecedor_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erro ao listar por fornecedor:', err);
      return res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }

    res.json(results);
  });
};


// ✅ BUSCAR PRODUTO POR ID
exports.buscarPorId = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM produtos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar produto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(results[0]);
  });
};


// ✅ CRIAR PRODUTO (AGORA DINÂMICO ✅)
exports.criar = (req, res) => {

  const { nome, descricao, marca, moq, preco, fornecedor_id } = req.body;

  const categoria_id = 1; // pode melhorar depois

  const imagem = req.file ? req.file.filename : null;

  const precoNumber = preco ? parseFloat(preco) : null;
  const moqNumber = moq ? parseInt(moq) : 1;

  if (!nome || !descricao || !fornecedor_id) {
    return res.status(400).json({ erro: 'Nome, descrição e fornecedor são obrigatórios' });
  }

  const sql = `
    INSERT INTO produtos 
    (nome, descricao, marca, moq, preco, fornecedor_id, categoria_id, imagem, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nome,
      descricao,
      marca || null,
      moqNumber,
      precoNumber,
      fornecedor_id, // ✅ AGORA DINÂMICO
      categoria_id,
      imagem,
      'ativo'
    ],
    (err, result) => {
      if (err) {
        console.error('ERRO MYSQL:', err);
        return res.status(500).json({ erro: 'Erro ao criar produto' });
      }

      res.status(201).json({
        mensagem: 'Produto criado com sucesso',
        id: result.insertId
      });
    }
  );
};


// ✅ ATUALIZAR PRODUTO
exports.atualizar = (req, res) => {
  const { id } = req.params;

  const { nome, descricao, marca, moq, preco } = req.body;

  const imagem = req.file ? req.file.filename : null;

  const precoNumber = preco ? parseFloat(preco) : null;
  const moqNumber = moq ? parseInt(moq) : 1;

  let sql;
  let params;

  if (imagem) {
    sql = `
      UPDATE produtos
      SET nome=?, descricao=?, marca=?, moq=?, preco=?, imagem=?
      WHERE id=?
    `;
    params = [nome, descricao, marca, moqNumber, precoNumber, imagem, id];
  } else {
    sql = `
      UPDATE produtos
      SET nome=?, descricao=?, marca=?, moq=?, preco=?
      WHERE id=?
    `;
    params = [nome, descricao, marca, moqNumber, precoNumber, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto atualizado com sucesso' });
  });
};


// ✅ DELETAR PRODUTO
exports.deletar = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM produtos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao deletar produto' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto deletado com sucesso' });
  });
};