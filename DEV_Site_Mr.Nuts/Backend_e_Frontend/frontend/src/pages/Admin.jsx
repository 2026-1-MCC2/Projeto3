import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'

import '../styles/admin.css'
import '../styles/global.css'

function Admin() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const [dropdownAberto, setDropdownAberto] =
    useState(false)

  const [produtos, setProdutos] = useState([])
  const [usuarios, setUsuarios] = useState([])

  // PROTEÇÃO

  useEffect(() => {

    if (!usuario || usuario.role !== 'admin') {

      alert('Acesso negado')

      navigate('/login')

      return

    }

    carregarProdutos()
    carregarUsuarios()

  }, [])

  // CARREGAR USUÁRIOS

  async function carregarUsuarios() {

    try {

      const response = await api.get('/usuarios')

      setUsuarios(response.data)

    } catch (error) {

      console.error(error)

    }
  }

  // DROPDOWN

  function toggleMenu() {

    setDropdownAberto(!dropdownAberto)

  }

  // CONFIG

  function abrirConta() {

    navigate('/admin-config')

  }

  // LOGOUT

  function logout() {

    localStorage.removeItem('usuario')

    navigate('/login')

  }

  // CARREGAR PRODUTOS

  async function carregarProdutos() {

    try {

      const response = await api.get('/anuncios')

      setProdutos(response.data)

    } catch (error) {

      console.error(error)

    }
  }

  // DELETAR

  async function deletarProduto(id) {

    const confirmar = confirm(
      'Deseja excluir este produto?'
    )

    if (!confirmar) {
      return
    }

    try {

      await api.delete(`/anuncios/${id}`)

      carregarProdutos()

      alert('Produto removido')

    } catch (error) {

      console.error(error)

      alert('Erro ao excluir')

    }
  }

  return (

    <>

      <Navbar />

      <header className="topbar">

        <div className="logo">

          <strong>
            Restocka Admin
          </strong>

        </div>

        <nav className="menu">

          <a href="#">
            Dashboard
          </a>

          <a href="#">
            Usuários
          </a>

          <a href="#">
            Produtos
          </a>

          <a href="#">
            Fornecedores
          </a>

          <a href="#">
            Relatórios
          </a>

        </nav>

        <div className="user-menu">

          <button onClick={toggleMenu}>
            Configurações
          </button>

          <div
            className="dropdown"
            style={{
              display:
                dropdownAberto
                  ? 'block'
                  : 'none'
            }}
          >

            <p className="user-name">

              {usuario?.nome}

            </p>

            <button onClick={abrirConta}>

              Configuração de conta

            </button>

            <button onClick={logout}>

              Sair

            </button>

          </div>

        </div>

      </header>

      <main>

        <h1>
          Bem-vindo ao Painel Administrativo
        </h1>

        {/* DASHBOARD */}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}
        >

          <div className="card">

            <h3>
              Produtos
            </h3>

            <h1>
              {produtos.length}
            </h1>

          </div>

          <div className="card">

            <h3>
              Usuários
            </h3>

            <h1>
              {usuarios.length}
            </h1>

          </div>

          <div className="card">

            <h3>
              Fornecedores
            </h3>

            <h1>

              {
                usuarios.filter(
                  (u) => u.role === 'supplier'
                ).length
              }

            </h1>

          </div>

        </section>

        <div className="card">

          <h3>
            Gerenciar Produtos
          </h3>

          <p>
            Aprovar, editar ou remover produtos.
          </p>

        </div>

        <div className="card">

          <h3>
            Usuários
          </h3>

          <p>
            Visualizar clientes e fornecedores.
          </p>

        </div>

        <div className="card">

          <h3>
            Fornecedores
          </h3>

          <p>
            Gerenciar fornecedores cadastrados.
          </p>

        </div>

        <div className="card">

          <h3>
            Relatórios
          </h3>

          <p>
            Analisar desempenho do marketplace.
          </p>

        </div>

        {/* PRODUTOS */}

        <div className="card">

          <h3>
            Produtos cadastrados
          </h3>

          {produtos.length === 0 ? (

            <p>
              Nenhum produto encontrado.
            </p>

          ) : (

            produtos.map((produto) => (

              <div
                key={produto.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '10px'
                }}
              >

                <h4>
                  {produto.nome}
                </h4>

                <p>
                  {produto.descricao}
                </p>

                <button
                  onClick={() =>
                    deletarProduto(produto.id)
                  }
                >
                  Excluir
                </button>

              </div>

            ))

          )}

        </div>

      </main>

    </>

  )
}

export default Admin
