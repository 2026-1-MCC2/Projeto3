-- ========================================
-- LIMPAR BANCO ANTIGO (OPCIONAL)
-- ========================================
DROP DATABASE IF EXISTS mrnut;

-- ========================================
-- CRIAR BANCO NOVO
-- ========================================
CREATE DATABASE IF NOT EXISTS reestocka;
USE reestocka;

-- ========================================
-- TABELAS
-- ========================================

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100)
);

CREATE TABLE fornecedor (
    id_fornecedor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100)
);

CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao TEXT,
    preco DECIMAL(10,2)
);

CREATE TABLE anuncio (
    id_anuncio INT AUTO_INCREMENT PRIMARY KEY,
    id_fornecedor INT,
    id_produto INT,
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE orcamento (
    id_orcamento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_anuncio INT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_anuncio) REFERENCES anuncio(id_anuncio)
);

CREATE TABLE resposta_orcamento (
    id_resposta INT AUTO_INCREMENT PRIMARY KEY,
    id_orcamento INT,
    id_fornecedor INT,
    preco DECIMAL(10,2),
    mensagem TEXT,
    FOREIGN KEY (id_orcamento) REFERENCES orcamento(id_orcamento),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor)
);

CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_resposta INT,
    status VARCHAR(50),
    frete DECIMAL(10,2),
    FOREIGN KEY (id_resposta) REFERENCES resposta_orcamento(id_resposta)
);

CREATE TABLE favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_anuncio INT,
    UNIQUE (id_cliente, id_anuncio),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_anuncio) REFERENCES anuncio(id_anuncio)
);

-- ========================================
-- DADOS DE TESTE (ORDEM CORRETA)
-- ========================================

INSERT INTO cliente (nome, email, senha)
VALUES ('Arthur', 'arthur@email.com', '123');

INSERT INTO fornecedor (nome, email, senha)
VALUES ('Fornecedor 1', 'fornecedor@email.com', '123');

INSERT INTO produto (nome, descricao, preco)
VALUES ('Produto Teste', 'Descrição teste', 100.00);

-- PRECISA EXISTIR ANTES
INSERT INTO anuncio (id_fornecedor, id_produto)
VALUES (1, 1);

-- AGORA FAVORITO FUNCIONA
INSERT INTO favoritos (id_cliente, id_anuncio)
VALUES (1, 1);

-- ========================================
-- TESTES
-- ========================================

SELECT * FROM cliente;
SELECT * FROM fornecedor;
SELECT * FROM produto;
SELECT * FROM anuncio;
SELECT * FROM favoritos;