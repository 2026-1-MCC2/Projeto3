CREATE DATABASE IF NOT EXISTS mrnut;
USE mrnut;

CREATE TABLE anuncios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  categoria ENUM('chips', 'castanhas', 'outros') NOT NULL,
  marca VARCHAR(50) NOT NULL,
  moq INT NOT NULL,
  regiao VARCHAR(100) NOT NULL,
  status ENUM('rascunho', 'ativo', 'pausado') DEFAULT 'rascunho',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);