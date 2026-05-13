<p align="center">
  <img src="./imagens/logo.jpeg" width="300"/>
</p>

<h1 align="center">DeuBug? - Marketplace B2B Mr.Nut</h1>

<p align="center">
  <b>Projeto Interdisciplinar - Ciência da Computação | FECAP</b>
</p>

---

## 📌 Sobre o Projeto

Este projeto foi desenvolvido como parte do **Projeto Interdisciplinar (PI)** da FECAP.

A aplicação consiste na plataforma **Mr.Nut**, um **Marketplace B2B (Business to Business)** voltado ao setor alimentício, com o objetivo de conectar **fornecedores e compradores**, como restaurantes, hotéis, distribuidores e mercados.

A plataforma funciona como um **hub de anúncios**, permitindo que fornecedores publiquem seus produtos e compradores encontrem opções de forma eficiente. O sistema não realiza pagamentos, sendo focado na comunicação e negociação entre as partes.

---

## 🎯 Objetivo Geral

Desenvolver uma plataforma web que facilite a conexão entre empresas do setor alimentício, organizando anúncios e melhorando a experiência de busca e negociação.

---

## 🎯 Objetivos Específicos

* Implementar sistema de cadastro e autenticação
* Criar controle de acesso por perfil (Fornecedor, Comprador e Administrador)
* Desenvolver CRUD completo de anúncios
* Implementar sistema de busca e filtros
* Permitir avaliações de fornecedores e anúncios
* Criar painel administrativo para moderação
* Modelar e implementar banco de dados relacional
* Permitir solicitação de orçamentos
* Possibilitar realização de pedidos (sem pagamento integrado)

---

## 👥 Integrantes

* Arthur Henrique dos Anjos Ferreira
* Guilherme Augusto Castilho
* Matheus Fadini Reis Parada
* Ryan Santos
* William Takuya Takeuchi Takaki

---

## 🏢 Nome da Equipe

**DeuBug?**

---

## ⚙️ Tecnologias Utilizadas

* Frontend: HTML, CSS e JavaScript
* Backend: Node.js + Express
* Banco de Dados: MySQL
* Ferramentas: Git, GitHub, Postman

---

## 🏗️ Estrutura do Projeto

/backend
/documentos
/frontend
/imagens
/MySql-BD
/src
.gitignore
README.md

---

## 🔐 Funcionalidades

### 👤 Fornecedor

* Cadastro e login
* Gerenciamento de anúncios
* Upload de imagens

### 🛒 Comprador

* Busca por produtos e fornecedores
* Aplicação de filtros
* Visualização de anúncios
* Sistema de favoritos
* Avaliações
* Solicitação de orçamentos
* Realização de pedidos

### 🛠️ Administrador

* Aprovação de anúncios
* Moderação de usuários
* Controle de avaliações
* Relatórios

---

## 🗄️ Banco de Dados

👉 [Diagrama](https://app.brmodeloweb.com/#!/publicview/69ca55c2b2c06f82f93ab5b1)
👉 [Tables SQL](https://github.com/2026-1-MCC2/Projeto3/blob/main/documentos/Entrega-2/Projeto%20em%20Banco%20de%20Dados/ENTREGA2%20BD.txt)
---

## 🚀 Execução do Projeto

Pré-requisitos

Node.js (v18+)
XAMPP (para MySQL)
VS Code com extensão Live Server (caso use o frontend estático)

1. Banco de Dados

Abra o XAMPP e inicie o serviço MySQL.
Acesse o phpMyAdmin (http://localhost/phpmyadmin) ou o terminal MySQL.
Crie o banco e rode o schema:

2. Backend (API)
bash# Entre na pasta do backend
cd DEV_Site_Mr.Nuts/Backend_e_Frontend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env   # ou crie manualmente (ver seção abaixo)

# Inicie o servidor
npm run dev
# ou: node src/server.js
O servidor estará disponível em http://localhost:3000.

3. Frontend (React + Vite)
Em outro terminal:
bash# Entre na pasta do frontend
cd DEV_Site_Mr.Nuts/Backend_e_Frontend/frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
Acesse a aplicação em http://localhost:5173.

A URL base da API é definida em um único arquivo:
frontend/src/services/api.js
jsimport axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'  // ← altere aqui se necessário
})

export default api
Para apontar para outro servidor (ex.: produção ou IP diferente), basta trocar o valor de baseURL:
jsbaseURL: 'http://SEU_IP_OU_DOMINIO:3000'

Via variável de ambiente (recomendado): crie .env na raiz do frontend com:
VITE_API_URL=http://localhost:3000
E atualize api.js para:
jsbaseURL: import.meta.env.VITE_API_URL

🗄️ Configuração do .env (Backend)
Crie o arquivo .env dentro de DEV_Site_Mr.Nuts/Backend_e_Frontend/ com o seguinte conteúdo:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA_MYSQL
DB_NAME=Nome_do_banco
PORT=3000

Fluxo de telas [Acessar](https://app.diagrams.net/?src=about#G1fHdL1Mx78KfpsEZl9pQQlVDFUW3atqil#%7B%22pageId%22%3A%22wKDXtJ8HPepuOkDO76dD%22%7D)


---

## 📁 Entregas do Projeto

👉 [Acessar documentos](./documentos)

---

## 📊 Metodologia

O projeto segue uma abordagem incremental:

1. Levantamento de requisitos
2. Modelagem do sistema
3. Desenvolvimento do backend
4. Integração com frontend
5. Testes e validações
6. Documentação e entrega final

---

## 📅 Cronograma

* Semanas 1-2: Planejamento
* Semanas 3-4: Modelagem
* Semanas 5-6: Backend
* Semanas 7-8: Módulo Fornecedor
* Semanas 9-10: Módulo Comprador
* Semanas 11-12: Testes
* Semana 13: Entrega final

---

## 📈 Diferenciais do Projeto

* Sistema de solicitação de orçamentos
* Funcionalidade de pedidos
* Interface simples e intuitiva
* Estrutura organizada

---

## 📌 Requisitos Não Funcionais

* Responsividade
* Segurança de dados
* Controle de acesso
* Boa usabilidade

---

## 📢 Status do Projeto

🚧 Em desenvolvimento

---

## 📬 Observação

Projeto acadêmico desenvolvido para fins educacionais na FECAP.
