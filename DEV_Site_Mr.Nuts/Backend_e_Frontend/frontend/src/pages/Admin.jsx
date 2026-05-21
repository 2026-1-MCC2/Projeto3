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

  const [dashboard, setDashboard] =
    useState({
      usuarios: 0,
      produtos: 0,
      fornecedores: 0,
      avaliacoes: 0,
      orcamentos: 0
    })

  const [produtos, setProdutos] =
    useState([])

  const [usuarios, setUsuarios] =
    useState([])

  const [pendentes, setPendentes] =
    useState([])

  const [anunciosPendentes, setAnunciosPendentes] =
    useState([])

  const [avaliacoes, setAvaliacoes] =
    useState([])

  useEffect(() => {

    if (!usuario || usuario.role !== 'admin') {

      alert('Acesso negado')

      navigate('/login')

      return

    }

    carregarDashboard()
    carregarProdutos()
    carregarUsuarios()
    carregarPendentes()
    carregarAnunciosPendentes()
    carregarAvaliacoes()

  }, [])

  async function carregarDashboard() {

    try {

      const response =
        await api.get('/dashboard')

      setDashboard(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  async function carregarProdutos() {

    try {

      const response =
        await api.get('/anuncios')

      setProdutos(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  async function carregarUsuarios() {

    try {

      const response =
        await api.get('/usuarios')

      setUsuarios(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  async function carregarPendentes() {

    try {

      const response =
        await api.get('/auth/pendentes')

      setPendentes(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  async function carregarAnunciosPendentes() {

    try {

      const response =
        await api.get('/anuncios/pendentes')

      setAnunciosPendentes(response.data)

    } catch (error) {

      console.error(error)

      alert('Erro ao carregar anúncios pendentes')

    }

  }

  async function carregarAvaliacoes() {

    try {

      const response =
        await api.get('/avaliacoes')

      setAvaliacoes(response.data)

    } catch (error) {

      console.error(error)

      alert('Erro ao carregar avaliações')

    }

  }

  async function aprovarFornecedor(id) {

    try {

      await api.put(
        `/auth/aprovar/${id}`
      )

      alert('Fornecedor aprovado')

      carregarPendentes()
      carregarUsuarios()
      carregarDashboard()

    } catch (error) {

      console.error(error)

      alert('Erro ao aprovar fornecedor')

    }

  }

  async function aprovarAnuncio(id) {

    try {

      await api.put(
        `/anuncios/aprovar/${id}`
      )

      alert('Anúncio aprovado')

      carregarAnunciosPendentes()
      carregarProdutos()
      carregarDashboard()

    } catch (error) {

      console.error(error)

      alert('Erro ao aprovar anúncio')

    }

  }

  async function reprovarAnuncio(id) {

    const motivo =
      prompt('Motivo da reprovação:')

    if (!motivo) {

      return

    }

    try {

      await api.put(
        `/anuncios/reprovar/${id}`,
        { motivo }
      )

      alert('Anúncio reprovado')

      carregarAnunciosPendentes()
      carregarDashboard()

    } catch (error) {

      console.error(error)

      alert('Erro ao reprovar anúncio')

    }

  }

  async function ocultarAvaliacao(id) {

    try {

      await api.put(
        `/avaliacoes/ocultar/${id}`
      )

      alert('Avaliação ocultada')

      carregarAvaliacoes()
      carregarDashboard()

    } catch (error) {

      console.error(error)

      alert('Erro ao ocultar avaliação')

    }

  }

  async function removerAvaliacao(id) {

    const confirmar =
      confirm('Deseja remover esta avaliação?')

    if (!confirmar) {

      return

    }

    try {

      await api.delete(
        `/avaliacoes/${id}`
      )

      alert('Avaliação removida')

      carregarAvaliacoes()
      carregarDashboard()

    } catch (error) {

      console.error(error)

      alert('Erro ao remover avaliação')

    }

  }

  async function deletarProduto(id) {

    const confirmar =
      confirm('Deseja excluir este produto?')

    if (!confirmar) {

      return

    }

    try {

      await api.delete(
        `/anuncios/${id}`
      )

      carregarProdutos()
      carregarDashboard()

      alert('Produto removido')

    } catch (error) {

      console.error(error)

      alert('Erro ao excluir produto')

    }

  }

  function toggleMenu() {

    setDropdownAberto(
      !dropdownAberto
    )

  }

  function abrirConta() {

    navigate('/admin-config')

  }

  function logout() {

    localStorage.removeItem('usuario')

    navigate('/login')

  }

  function irParaSecao(id) {

    const secao =
      document.getElementById(id)

    if (secao) {

      secao.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

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

          <button
            type="button"
            className="menu-link"
            onClick={() => irParaSecao('dashboard')}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="menu-link"
            onClick={() => irParaSecao('usuarios')}
          >
            Usuários
          </button>

          <button
            type="button"
            className="menu-link"
            onClick={() => irParaSecao('produtos')}
          >
            Produtos
          </button>

          <button
            type="button"
            className="menu-link"
            onClick={() => irParaSecao('fornecedores')}
          >
            Fornecedores
          </button>

          <button
            type="button"
            className="menu-link"
            onClick={() => irParaSecao('relatorios')}
          >
            Relatórios
          </button>

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

        <section
          id="dashboard"
          className="dashboard-grid"
        >

          <div className="dashboard-card">

            <h3>
              Produtos
            </h3>

            <h1>
              {dashboard.produtos}
            </h1>

            <p>
              Total cadastrado
            </p>

          </div>

          <div className="dashboard-card">

            <h3>
              Usuários
            </h3>

            <h1>
              {dashboard.usuarios}
            </h1>

            <p>
              Total de contas
            </p>

          </div>

          <div className="dashboard-card">

            <h3>
              Fornecedores
            </h3>

            <h1>
              {dashboard.fornecedores}
            </h1>

            <p>
              Fornecedores ativos
            </p>

          </div>

          <div className="dashboard-card">

            <h3>
              Avaliações
            </h3>

            <h1>
              {dashboard.avaliacoes}
            </h1>

            <p>
              Total recebido
            </p>

          </div>

          <div className="dashboard-card">

            <h3>
              Orçamentos
            </h3>

            <h1>
              {dashboard.orcamentos}
            </h1>

            <p>
              Solicitações feitas
            </p>

          </div>

        </section>

        <div
          id="fornecedores"
          className="card"
        >

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
                  className="admin-item"
                >

                  <h4>
                    {fornecedor.nome}
                  </h4>

                  <p>
                    {fornecedor.email}
                  </p>

                  <button
                    className="btn-aprovar"
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

        <div
          id="usuarios"
          className="card"
        >

          <h2>
            Usuários
          </h2>

          {
            usuarios.length === 0 ? (

              <p>
                Nenhum usuário encontrado.
              </p>

            ) : (

              usuarios.map((user) => (

                <div
                  key={user.id}
                  className="admin-item"
                >

                  <h4>
                    {user.nome}
                  </h4>

                  <p>
                    {user.email}
                  </p>

                  <p>
                    <strong>
                      Perfil:
                    </strong>
                    {' '}
                    {user.role}
                  </p>

                </div>

              ))

            )
          }

        </div>

        <div className="card">

          <h2>
            Anúncios Pendentes
          </h2>

          {
            anunciosPendentes.length === 0 ? (

              <p>
                Nenhum anúncio pendente.
              </p>

            ) : (

              anunciosPendentes.map((produto) => (

                <div
                  key={produto.id}
                  className="admin-item"
                >

                  <h3>
                    {produto.nome}
                  </h3>

                  <p>
                    {produto.descricao}
                  </p>

                  <p>
                    <strong>
                      Fornecedor:
                    </strong>
                    {' '}
                    {produto.fornecedor_nome}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>
                    {' '}
                    {produto.status}
                  </p>

                  <div className="admin-actions">

                    <button
                      className="btn-aprovar"
                      onClick={() =>
                        aprovarAnuncio(
                          produto.id
                        )
                      }
                    >

                      Aprovar

                    </button>

                    <button
                      className="btn-reprovar"
                      onClick={() =>
                        reprovarAnuncio(
                          produto.id
                        )
                      }
                    >

                      Reprovar

                    </button>

                  </div>

                </div>

              ))

            )
          }

        </div>

        <div
          id="produtos"
          className="card"
        >

          <h2>
            Produtos cadastrados
          </h2>

          {
            produtos.length === 0 ? (

              <p>
                Nenhum produto encontrado.
              </p>

            ) : (

              produtos.map((produto) => (

                <div
                  key={produto.id}
                  className="admin-item"
                >

                  <h4>
                    {produto.nome}
                  </h4>

                  <p>
                    {produto.descricao}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>
                    {' '}
                    {produto.status}
                  </p>

                  <button
                    className="btn-reprovar"
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

        <div
          id="relatorios"
          className="card"
        >

          <h2>
            Moderação de Avaliações
          </h2>

          {
            avaliacoes.length === 0 ? (

              <p>
                Nenhuma avaliação encontrada.
              </p>

            ) : (

              avaliacoes.map((avaliacao) => (

                <div
                  key={avaliacao.id}
                  className="admin-item"
                >

                  <h4>
                    {avaliacao.produto_nome}
                  </h4>

                  <p>
                    <strong>
                      Usuário:
                    </strong>
                    {' '}
                    {avaliacao.usuario_nome}
                  </p>

                  <p>
                    <strong>
                      Nota:
                    </strong>
                    {' '}
                    {avaliacao.estrelas}
                  </p>

                  <p>
                    {avaliacao.comentario}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>
                    {' '}
                    {
                      avaliacao.visivel
                        ? 'Visível'
                        : 'Oculta'
                    }
                  </p>

                  <div className="admin-actions">

                    <button
                      className="btn-aprovar"
                      onClick={() =>
                        ocultarAvaliacao(
                          avaliacao.id
                        )
                      }
                    >

                      Ocultar

                    </button>

                    <button
                      className="btn-reprovar"
                      onClick={() =>
                        removerAvaliacao(
                          avaliacao.id
                        )
                      }
                    >

                      Remover

                    </button>

                  </div>

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