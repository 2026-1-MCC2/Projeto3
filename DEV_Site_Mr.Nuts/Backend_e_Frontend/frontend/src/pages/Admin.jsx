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
    carregarAnunciosPendentes()
    carregarAvaliacoes()

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
  // CARREGAR FORNECEDORES PENDENTES
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
  // CARREGAR ANÚNCIOS PENDENTES
  // ============================================================

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

  // ============================================================
  // CARREGAR AVALIAÇÕES
  // ============================================================

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
  // APROVAR ANÚNCIO
  // ============================================================

  async function aprovarAnuncio(id) {

    try {

      await api.put(
        `/anuncios/aprovar/${id}`
      )

      alert('Anúncio aprovado ✅')

      carregarAnunciosPendentes()
      carregarProdutos()

    } catch (error) {

      console.error(error)

      alert('Erro ao aprovar anúncio')

    }

  }

  // ============================================================
  // REPROVAR ANÚNCIO
  // ============================================================

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

      alert('Anúncio reprovado ❌')

      carregarAnunciosPendentes()

    } catch (error) {

      console.error(error)

      alert('Erro ao reprovar anúncio')

    }

  }

  // ============================================================
  // OCULTAR AVALIAÇÃO
  // ============================================================

  async function ocultarAvaliacao(id) {

    try {

      await api.put(
        `/avaliacoes/ocultar/${id}`
      )

      alert('Avaliação ocultada')

      carregarAvaliacoes()

    } catch (error) {

      console.error(error)

      alert('Erro ao ocultar avaliação')

    }

  }

  // ============================================================
  // REMOVER AVALIAÇÃO
  // ============================================================

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

    } catch (error) {

      console.error(error)

      alert('Erro ao remover avaliação')

    }

  }

  // ============================================================
  // DELETAR PRODUTO
  // ============================================================

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
              'repeat(4, 1fr)',
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

          <div className="card">

            <h3>
              Anúncios Pendentes
            </h3>

            <h1>
              {anunciosPendentes.length}
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

        {/* ANÚNCIOS PENDENTES */}

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

                      ✅ Aprovar

                    </button>

                    <button
                      className="btn-reprovar"
                      onClick={() =>
                        reprovarAnuncio(
                          produto.id
                        )
                      }
                    >

                      ❌ Reprovar

                    </button>

                  </div>

                </div>

              ))

            )
          }

        </div>

        {/* PRODUTOS */}

        <div className="card">

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

        {/* MODERAÇÃO DE AVALIAÇÕES */}

        <div className="card">

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