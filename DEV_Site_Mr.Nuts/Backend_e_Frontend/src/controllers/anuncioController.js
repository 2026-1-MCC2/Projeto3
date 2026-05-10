const db = require('../config/db');


// ✅ LISTAR TODOS OS PRODUTOS
exports.listar = (req, res) => {

  const sql = `
    SELECT * FROM produtos
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        erro: 'Erro ao listar produtos'
      });
    }

    res.json(results);

  });

};


// ✅ LISTAR PRODUTOS DO FORNECEDOR
exports.listarPorFornecedor = (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT * FROM produtos
    WHERE fornecedor_id = ?
  `;

  db.query(sql, [id], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        erro: 'Erro ao buscar produtos'
      });
    }

    res.json(results);

  });

};


// ✅ BUSCAR PRODUTO POR ID
exports.buscarPorId = (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT * FROM produtos
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        erro: 'Erro ao buscar produto'
      });
    }

    if (results.length === 0) {

      return res.status(404).json({
        erro: 'Produto não encontrado'
      });

    }

    res.json(results[0]);

  });

};


// ✅ CRIAR PRODUTO
exports.criar = (req, res) => {

  console.log(req.body);

  const {
    nome,
    descricao,
    marca,
    moq,
    fornecedor_id
  } = req.body;

  // ✅ valores padrão
  const categoria_id = 1;
  const imagem = null;

  // ✅ validação
  if (!nome || !descricao) {

    return res.status(400).json({
      erro: 'Nome e descrição são obrigatórios'
    });

  }

  const sql = `
    INSERT INTO produtos
    (
      nome,
      descricao,
      marca,
      moq,
      fornecedor_id,
      categoria_id,
      imagem,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome,
    descricao,
    marca || 'Sem marca',
    moq || 1,
    fornecedor_id || 1,
    categoria_id,
    imagem,
    'active'
  ];

  db.query(sql, values, (err, result) => {

    if (err) {

      console.error('ERRO MYSQL:', err);

      return res.status(500).json({
        erro: 'Erro ao criar produto'
      });

    }

    res.status(201).json({
      mensagem: 'Produto criado com sucesso',
      id: result.insertId
    });

  });

};


// ✅ ATUALIZAR PRODUTO
exports.atualizar = (req, res) => {

  const { id } = req.params;

  const {
    nome,
    descricao,
    marca,
    moq,
    preco
  } = req.body;

  const sql = `
    UPDATE produtos
    SET
      nome = ?,
      descricao = ?,
      marca = ?,
      moq = ?,
      preco = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      nome,
      descricao,
      marca,
      moq,
      preco,
      id
    ],
    (err, result) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          erro: 'Erro ao atualizar produto'
        });

      }

      if (result.affectedRows === 0) {

        return res.status(404).json({
          erro: 'Produto não encontrado'
        });

      }

      res.json({
        mensagem: 'Produto atualizado com sucesso'
      });

    }
  );

};


// ✅ DELETAR PRODUTO
exports.deletar = (req, res) => {

  const { id } = req.params;

  const sql = `
    DELETE FROM produtos
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: 'Erro ao deletar produto'
      });

    }

    if (result.affectedRows === 0) {

      return res.status(404).json({
        erro: 'Produto não encontrado'
      });

    }

    res.json({
      mensagem: 'Produto deletado com sucesso'
    });

  });

};