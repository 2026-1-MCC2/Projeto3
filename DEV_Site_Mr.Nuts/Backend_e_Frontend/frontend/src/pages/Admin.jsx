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

  const [pendentes, setPendentes] =
    useState([])

  // ============================================================
  // PROTEÇÃO
  // ============================================================

  useEffect(() => {

    if (!usuario || usuario.role !== 'admin') {

      alert('Acesso negado')

      navigate('/login')

      return

    }

    carregarProdutos()

    carregarUsuarios()

    carregarPendentes()

  }, [])

  // ============================================================
  // CARREGAR PRODUTOS
  // ============================================================

  async function carregarProdutos() {

    try {

      const response =
        await api.get('/anuncios')

      setProdutos(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  // ============================================================
  // CARREGAR USUÁRIOS
  // ============================================================

  async function carregarUsuarios() {

    try {

      const response =
        await api.get('/usuarios')

      setUsuarios(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  // ============================================================
  // CARREGAR PENDENTES
  // ============================================================

  async function carregarPendentes() {

    try {

      const response =
        await api.get('/auth/pendentes')

      setPendentes(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  // ============================================================
  // APROVAR FORNECEDOR
  // ============================================================

  async function aprovarFornecedor(id) {

    try {

      await api.put(
        `/auth/aprovar/${id}`
      )

      alert('Fornecedor aprovado')

      carregarPendentes()

      carregarUsuarios()

    } catch (error) {

      console.error(error)

      alert('Erro ao aprovar fornecedor')

    }

  }

  // ============================================================
  // DELETAR PRODUTO
  // ============================================================

  async function deletarProduto(id) {

    const confirmar = confirm(
      'Deseja excluir este produto?'
    )

    if (!confirmar) {

      return

    }

    try {

      await api.delete(
        `/anuncios/${id}`
      )

      carregarProdutos()

      alert('Produto removido')

    } catch (error) {

      console.error(error)

      alert('Erro ao excluir produto')

    }

  }

  // ============================================================
  // DROPDOWN
  // ============================================================

  function toggleMenu() {

    setDropdownAberto(
      !dropdownAberto
    )

  }

  // ============================================================
  // CONFIG
  // ============================================================

  function abrirConta() {

    navigate('/admin-config')

  }

  // ============================================================
  // LOGOUT
  // ============================================================

  function logout() {

    localStorage.removeItem('usuario')

    navigate('/login')

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
            gridTemplateColumns:
              'repeat(3, 1fr)',
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
                  (u) =>
                    u.role === 'supplier'
                ).length

              }

            </h1>

          </div>

        </section>

        {/* FORNECEDORES PENDENTES */}

        <div className="card">

          <h2>
            Fornecedores Pendentes
          </h2>

          {

            pendentes.length === 0 ? (

              <p>
                Nenhum fornecedor pendente.
              </p>

            ) : (

              pendentes.map((fornecedor) => (

                <div
                  key={fornecedor.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '15px'
                  }}
                >

                  <h4>
                    {fornecedor.nome}
                  </h4>

                  <p>
                    {fornecedor.email}
                  </p>

                  <button
                    onClick={() =>
                      aprovarFornecedor(
                        fornecedor.id
                      )
                    }
                  >

                    Aprovar fornecedor

                  </button>

                </div>

              ))

            )

          }

        </div>

        {/* PRODUTOS */}

        <div className="card">

          <h3>
            Produtos cadastrados
          </h3>

          {

            produtos.length === 0 ? (

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
                      deletarProduto(
                        produto.id
                      )
                    }
                  >

                    Excluir

                  </button>

                </div>

              ))

            )

          }

        </div>

      </main>

    </>

  )

}

export default Admin
