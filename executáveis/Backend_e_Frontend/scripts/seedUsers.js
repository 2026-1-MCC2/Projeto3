require('dotenv').config()

const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function seedUsers() {

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  console.log('Conectado ao banco.')

  const senhaPadrao = '123456'

  const senha_hash = await bcrypt.hash(senhaPadrao, 10)

  // GARANTIR CATEGORIA

  await connection.execute(`
    INSERT INTO categorias (nome)
    VALUES ('Categoria Teste')
    ON DUPLICATE KEY UPDATE nome = nome
  `)

  // USUÁRIOS DEMO

  const usuarios = [
    {
      nome: 'Administrador Demo',
      email: 'admin@demo.com',
      role: 'admin',
      status: 'ativo'
    },
    {
      nome: 'Fornecedor Demo',
      email: 'fornecedor@demo.com',
      role: 'supplier',
      status: 'ativo'
    },
    {
      nome: 'Cliente Demo',
      email: 'cliente@demo.com',
      role: 'buyer',
      status: 'ativo'
    }
  ]

  for (const usuario of usuarios) {

    await connection.execute(
      `
        INSERT INTO usuarios
        (
          nome,
          email,
          senha_hash,
          role,
          status
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nome = VALUES(nome),
          senha_hash = VALUES(senha_hash),
          role = VALUES(role),
          status = VALUES(status)
      `,
      [
        usuario.nome,
        usuario.email,
        senha_hash,
        usuario.role,
        usuario.status
      ]
    )

  }

  // BUSCAR ID DO FORNECEDOR

  const [fornecedorUsuario] = await connection.execute(
    `
      SELECT id
      FROM usuarios
      WHERE email = ?
    `,
    ['fornecedor@demo.com']
  )

  const fornecedorUsuarioId = fornecedorUsuario[0].id

  // CRIAR PERFIL DO FORNECEDOR

  await connection.execute(
    `
      INSERT INTO fornecedores
      (
        usuario_id,
        nome_empresa,
        cnpj,
        email_contato
      )
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nome_empresa = VALUES(nome_empresa),
        email_contato = VALUES(email_contato)
    `,
    [
      fornecedorUsuarioId,
      'Empresa Demo',
      '12.345.678/0001-99',
      'fornecedor@demo.com'
    ]
  )

  console.log('Usuários demo criados/atualizados com sucesso.')
  console.log('Senha padrão de todos: 123456')

  await connection.end()

}

seedUsers()
  .catch((error) => {
    console.error('Erro ao executar seed:', error)
    process.exit(1)
  })
