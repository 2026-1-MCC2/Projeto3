import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from '  const [produtos, setProdutos] = useState([])import { useLocation, useNavigate } from 'react-router-dom'
  const [orcamentos, setOrcamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const [busca, setBusca] = useState(buscaInicial)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [regiaoSelecionada, setRegiaoSelecionada] = useState('')
  const [moqMaximo, setMoqMaximo] = useState(5000)

  useEffect(() => {
    if (!usuario || usuario.role !== 'buyer') {
      alert('Acesso negado')
      navigate('/login')
      return
    }

    carregarProdutos()
    carregarMeusOrcamentos()
  }, [])

  useEffect(() => {
    const parametrosAtualizados = new URLSearchParams(location.search)
    const novaBusca = parametrosAtualizados.get('busca') || ''

    setBusca(novaBusca)
  }, [location.search])

  async function carregarProdutos() {
    try {
      setLoading(true)

      const response = await api.get('/anuncios')

      setProdutos(response.data)
      setErro('')
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      setErro('Erro ao carregar produtos do banco de dados.')
    } finally {
      setLoading(false)
    }
  }

  async function carregarMeusOrcamentos() {
    try {
      const response = await api.get(`/orcamentos/cliente/${usuario.id}`)
      setOrcamentos(response.data)
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error)
    }
  }

  async function cancelarOrcamento(id) {
    const confirmar = window.confirm('Deseja cancelar este orçamento?')

    if (!confirmar) {
      return
    }

    try {
      const response = await api.patch(`/orcamentos/${id}/cancelar`)

      alert(response.data.mensagem || 'Orçamento cancelado com sucesso')
      carregarMeusOrcamentos()
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao cancelar orçamento'
      )
    }
  }

  async function fecharOrcamento(id) {
    const confirmar = window.confirm('Deseja fechar este orçamento?')

    if (!confirmar) {
      return
    }

    try {
      const response = await api.patch(`/orcamentos/${id}/fechar`)

      alert(response.data.mensagem || 'Orçamento fechado com sucesso')
      carregarMeusOrcamentos()
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao fechar orçamento'
      )
    }
  }

  function formatarStatus(status) {
    if (status === 'pending') return 'Pendente'
    if (status === 'responded') return 'Respondido'
    if (status === 'closed') return 'Fechado'
    if (status === 'cancelled') return 'Cancelado'

    return status || 'Não informado'
  }

  function obterNomeProduto(produto) {
    return (
      produto.nome ||
      produto.titulo ||
      produto.produto_nome ||
      ''
    )
  }

  function obterCategoria(produto) {
    return (
      produto.categoria_nome ||
      produto.categoria ||
      produto.nome_categoria ||
      'Sem categoria'
    )
  }

  function obterFornecedor(produto) {
    return (
      produto.fornecedor_nome ||
      produto.nome_empresa ||
      produto.fornecedor ||
      ''
    )
  }

  function obterRegiao(produto) {
    return (
      produto.regiao ||
      produto.estado ||
      produto.localizacao ||
      produto.cidade ||
      'Nacional'
    )
  }

  function obterMoq(produto) {
    return Number(
      produto.moq ||
      produto.quantidade_minima ||
      produto.moq_minimo ||
      0
    )
  }

  const categorias = useMemo(() => {
    const mapa = {}

    produtos.forEach((produto) => {
      const categoria = obterCategoria(produto)

      if (!mapa[categoria]) {
        mapa[categoria] = {
          nome: categoria,
          total: 0
        }
      }

      mapa[categoria].total += 1
    })

    return Object.values(mapa)
  }, [produtos])

  const regioes = useMemo(() => {
    const mapa = {}

    produtos.forEach((produto) => {
      const regiao = obterRegiao(produto)

      if (!mapa[regiao]) {
        mapa[regiao] = regiao
      }
    })

    return Object.values(mapa)
  }, [produtos])

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim()

    return produtos.filter((produto) => {
      const nome = obterNomeProduto(produto).toLowerCase()
      const descricao = String(produto.descricao || '').toLowerCase()
      const fornecedor = obterFornecedor(produto).toLowerCase()
      const categoria = obterCategoria(produto).toLowerCase()
      const regiao = obterRegiao(produto).toLowerCase()
      const moq = obterMoq(produto)

      const passouBusca =
        !termo ||
        nome.includes(termo) ||
        descricao.includes(termo) ||
        fornecedor.includes(termo) ||
        categoria.includes(termo) ||
        regiao.includes(termo)

      const passouCategoria =
        !categoriaSelecionada ||
        categoria === categoriaSelecionada.toLowerCase()

      const passouRegiao =
        !regiaoSelecionada ||
        regiao === regiaoSelecionada.toLowerCase()

      const passouMoq =
        !moqMaximo ||
        moq === 0 ||
        moq <= Number(moqMaximo)

      return (
        passouBusca &&
        passouCategoria &&
        passouRegiao &&
        passouMoq
      )
    })
  }, [
    produtos,
    busca,
    categoriaSelecionada,
    regiaoSelecionada,
    moqMaximo
  ])

  function buscarProdutos() {
    const termo = busca.trim()

    if (!termo) {
      navigate('/cliente')
      return
    }

    navigate(`/cliente?busca=${encodeURIComponent(termo)}`)
  }

  function buscarComEnter(event) {
    if (event.key === 'Enter') {
      buscarProdutos()
    }
  }

  function limparFiltros() {
    setBusca('')
    setCategoriaSelecionada('')
    setRegiaoSelecionada('')
    setMoqMaximo(5000)

    navigate('/cliente')
  }

  async function adicionarFavorito(produto) {
    if (!usuario) {
      alert('Faça login para favoritar produtos')
      return
    }

    try {
      const response = await api.post('/favoritos/produto', {
        usuario_id: usuario.id,
        produto_id: produto.id
      })

      alert(response.data.mensagem)
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao favoritar produto'
      )
    }
  }

  async function adicionarFornecedorFavorito(produto) {
    if (!usuario) {
      alert('Faça login para favoritar fornecedores')
      return
    }

    if (!produto.fornecedor_id) {
      alert('Fornecedor não encontrado para este produto')
      return
    }

    try {
      const response = await api.post('/favoritos/fornecedor', {
        usuario_id: usuario.id,
        fornecedor_id: produto.fornecedor_id
      })

      alert(response.data.mensagem)
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao favoritar fornecedor'
      )
    }
  }

  function deletarProduto() {
    alert('Apenas fornecedores ou administradores podem excluir anúncios.')
  }

  return (
    <>
      <Navbar />

      <main className="marketplace-page">

        <section className="marketplace-top">

          <h1>
            Anúncios de Produtos
          </h1>

          <div className="marketplace-search-row">

            <input
              className="marketplace-search-input"
              placeholder="Buscar produto, marca, fornecedor..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              onKeyDown={buscarComEnter}
            />

            <button
              type="button"
              className="marketplace-search-button"
              onClick={buscarProdutos}
            >
              Buscar
            </button>

            <button
              type="button"
              className="marketplace-clear-button"
              onClick={limparFiltros}
            >
              Limpar
            </button>

          </div>

        </section>

        <section className="marketplace-content">

          <aside className="filters-sidebar">

            <div className="filters-title-row">

              <h2>
                Filtros
              </h2>

              <button
                type="button"
                onClick={limparFiltros}
              >
                Limpar
              </button>

            </div>

            <div className="filter-block">

              <h3>
                CATEGORIA
              </h3>

              {categorias.length === 0 && (
                <p className="filter-empty">
                  Nenhuma categoria
                </p>
              )}

              {categorias.map((categoria) => (
                <label
                  key={categoria.nome}
                  className="filter-option"
                >
                  <input
                    type="checkbox"
                    checked={categoriaSelecionada === categoria.nome}
                    onChange={() =>
                      setCategoriaSelecionada(
                        categoriaSelecionada === categoria.nome
                          ? ''
                          : categoria.nome
                      )
                    }
                  />

                  <span>
                    {categoria.nome}
                  </span>

                  <small>
                    {categoria.total}
                  </small>
                </label>
              ))}

            </div>

            <div className="filter-block">

              <h3>
                REGIÃO
              </h3>

              {regioes.length === 0 && (
                <p className="filter-empty">
                  Nenhuma região
                </p>
              )}

              {regioes.map((regiao) => (
                <label
                  key={regiao}
                  className="filter-option"
                >
                  <input
                    type="checkbox"
                    checked={regiaoSelecionada === regiao}
                    onChange={() =>
                      setRegiaoSelecionada(
                        regiaoSelecionada === regiao
                          ? ''
                          : regiao
                      )
                    }
                  />

                  <span>
                    {regiao}
                  </span>
                </label>
              ))}

            </div>

            <div className="filter-block">

              <h3>
                MOQ MÁXIMO
              </h3>

              <input
                className="moq-range"
                type="range"
                min="0"
                max="5000"
                value={moqMaximo}
                onChange={(event) => setMoqMaximo(event.target.value)}
              />

              <p className="moq-text">
                Até {moqMaximo} unidades
              </p>

            </div>

          </aside>

          <section className="marketplace-results">

            {loading && (
              <p className="empty-message">
                Carregando produtos...
              </p>
            )}

            {erro && (
              <p className="empty-message">
                {erro}
              </p>
            )}

            {!loading && !erro && produtosFiltrados.length === 0 && (
              <p className="empty-message">
                Nenhum produto encontrado.
              </p>
            )}

            {!loading && !erro && produtosFiltrados.length > 0 && (
              <ProdutoList
                produtos={produtosFiltrados}
                adicionarFavorito={adicionarFavorito}
                adicionarFornecedorFavorito={adicionarFornecedorFavorito}
                deletarProduto={deletarProduto}
              />
            )}

          </section>

        </section>

        <section className="card">

          <h2>
            Meus Orçamentos
          </h2>

          {orcamentos.length === 0 ? (

            <p>
              Nenhuma solicitação de orçamento enviada.
            </p>

          ) : (

            orcamentos.map((orcamento) => (

              <div
                key={orcamento.id}
                className="admin-item"
              >

                <h4>
                  {orcamento.produto_nome ||
                    orcamento.produto_nome_banco ||
                    'Produto não informado'}
                </h4>

                <p>
                  <strong>
                    Fornecedor:
                  </strong>
                  {' '}
                  {orcamento.fornecedor_empresa ||
                    orcamento.fornecedor_nome ||
                    'Não informado'}
                </p>

                <p>
                  <strong>
                    Quantidade:
                  </strong>
                  {' '}
                  {orcamento.quantidade || 'Não informada'}
                </p>

                <p>
                  <strong>
                    Necessidades:
                  </strong>
                  {' '}
                  {orcamento.necessidades || 'Não informado'}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>
                  {' '}
                  {formatarStatus(orcamento.status)}
                </p>

                {orcamento.resposta && (

                  <p>
                    <strong>
                      Resposta do fornecedor:
                    </strong>
                    {' '}
                    {orcamento.resposta}
                  </p>

                )}

                {orcamento.status === 'pending' && (

                  <button
                    type="button"
                    className="btn-reprovar"
                    onClick={() => cancelarOrcamento(orcamento.id)}
                  >
                    Cancelar orçamento
                  </button>

                )}

                {orcamento.status === 'responded' && (

                  <button
                    type="button"
                    className="btn-aprovar"
                    onClick={() => fecharOrcamento(orcamento.id)}
                  >
                    Fechar orçamento
                  </button>

                )}

              </div>

            ))

          )}

        </section>

      </main>
    </>
  )
}

export default Cliente

import Navbar from '../components/Navbar'
import ProdutoList from '../components/ProdutoList'
import api from '../services/api'

import '../styles/global.css'
import '../styles/marketplace.css'

function Cliente() {
  const navigate = useNavigate()
  const location = useLocation()

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const parametros = new URLSearchParams(location.search)
  const buscaInicial = parametros.get('busca') 