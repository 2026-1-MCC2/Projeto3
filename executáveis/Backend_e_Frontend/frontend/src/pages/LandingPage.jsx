import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import api from '../services/api'

import '../styles/home.css'

function LandingPage() {
  const [busca, setBusca] = useState('')
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    carregarAnuncios()
  }, [])

  async function carregarAnuncios() {
    try {
      setLoading(true)

      const response = await api.get('/anuncios')

      setAnuncios(response.data)
      setErro('')
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error)
      setErro('Erro ao carregar anúncios.')
    } finally {
      setLoading(false)
    }
  }

  function buscarProduto() {
    const termo = busca.trim()

    if (!termo) {
      return
    }

    navigate(`/marketplace?busca=${encodeURIComponent(termo)}`)
  }

  function buscarComEnter(event) {
    if (event.key === 'Enter') {
      buscarProduto()
    }
  }

  function obterNomeProduto(anuncio) {
    return (
      anuncio.nome ||
      anuncio.titulo ||
      anuncio.produto_nome ||
      'Produto sem nome'
    )
  }

  function obterCategoria(anuncio) {
    return (
      anuncio.categoria ||
      anuncio.categoria_nome ||
      anuncio.nome_categoria ||
      'Outros'
    )
  }

  function obterFornecedor(anuncio) {
    return (
      anuncio.nome_empresa ||
      anuncio.fornecedor ||
      anuncio.fornecedor_nome ||
      'Fornecedor disponível'
    )
  }

  function obterPreco(anuncio) {
    if (!anuncio.preco) {
      return 'Preço sob consulta'
    }

    const precoNumerico = Number(anuncio.preco)

    if (Number.isNaN(precoNumerico)) {
      return 'Preço sob consulta'
    }

    return precoNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  function obterEmojiCategoria(categoria) {
    const nome = String(categoria).toLowerCase()

    if (nome.includes('chip') || nome.includes('snack')) return '🍟'
    if (nome.includes('castanha')) return '🥜'
    if (nome.includes('bebida')) return '🥤'
    if (nome.includes('ingrediente')) return '🧂'
    if (nome.includes('congelado')) return '🧊'

    return '📦'
  }

  const categorias = useMemo(() => {
    const mapaCategorias = {}

    anuncios.forEach((anuncio) => {
      const nomeCategoria = obterCategoria(anuncio)

      if (!mapaCategorias[nomeCategoria]) {
        mapaCategorias[nomeCategoria] = {
          nome: nomeCategoria,
          total: 0,
          emoji: obterEmojiCategoria(nomeCategoria)
        }
      }

      mapaCategorias[nomeCategoria].total += 1
    })

    return Object.values(mapaCategorias)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [anuncios])

  const produtosMaisBuscados = useMemo(() => {
    return anuncios.slice(0, 4)
  }, [anuncios])

  return (
    <>
      <Navbar />

      <section className="hero">

        <div className="hero-left">
          
          <h1>
            Reabasteça seu negócio mais rápido com <span>Restocka</span>
          </h1>

          <p>
            Conectamos fornecedores de alimentos a restaurantes, hotéis,
            distribuidores e redes de varejo. Encontre, compare, solicite
            orçamentos e contate diretamente.
          </p>

          <div className="search-box">
            <input
              placeholder="Buscar chips, castanhas, bebidas..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              onKeyDown={buscarComEnter}
            />

            <button
              type="button"
              onClick={buscarProduto}
            >
              Buscar
            </button>
          </div>

        </div>

        <div className="hero-right">

          <div className="glass-card">

            <h3>CATEGORIAS POPULARES</h3>

            <div className="grid">

              {loading && (
                <div className="cat-box">
                  Carregando...
                </div>
              )}

              {!loading && categorias.length === 0 && (
                <div className="cat-box">
                  Nenhuma categoria
                </div>
              )}

              {!loading && categorias.slice(0, 4).map((categoria) => (
                <div className="cat-box" key={categoria.nome}>
                  {categoria.emoji} {categoria.nome}
                </div>
              ))}

            </div>

          </div>

        </div>

        <div className="glow"></div>

      </section>

      {/* CATEGORIAS */}
      <section className="categories-section">

        <span className="section-pill">CATEGORIAS</span>

        <h2>Explore por categoria</h2>

        <p>
          Encontre exatamente o que seu negócio precisa
        </p>

        {loading && (
          <p className="products-message">
            Carregando categorias...
          </p>
        )}

        {erro && (
          <p className="products-message">
            {erro}
          </p>
        )}

        {!loading && !erro && categorias.length === 0 && (
          <p className="products-message">
            Nenhuma categoria encontrada.
          </p>
        )}

        {!loading && !erro && categorias.length > 0 && (
          <div className="categories-row">

            {categorias.map((categoria, index) => (
              <div
                className={`category-card ${index === 4 ? 'active' : ''}`}
                key={categoria.nome}
              >
                <span>{categoria.emoji}</span>

                <h3>{categoria.nome}</h3>

                <p>
                  {categoria.total} {categoria.total === 1 ? 'anúncio' : 'anúncios'}
                </p>
              </div>
            ))}

          </div>
        )}

      </section>

      {/* PRODUTOS */}
      <section className="products-section">

        <span className="section-pill">ANÚNCIOS</span>

        <h2>Produtos mais buscados</h2>

        <p>
          Anúncios ativos disponíveis agora
        </p>

        {loading && (
          <p className="products-message">
            Carregando produtos...
          </p>
        )}

        {erro && (
          <p className="products-message">
            {erro}
          </p>
        )}

        {!loading && !erro && produtosMaisBuscados.length === 0 && (
          <p className="products-message">
            Nenhum produto cadastrado no momento.
          </p>
        )}

        {!loading && !erro && produtosMaisBuscados.length > 0 && (
          <div className="products-row">

            {produtosMaisBuscados.map((anuncio, index) => (
              <div
                className={`product-card ${index === 3 ? 'green' : ''}`}
                key={anuncio.id}
              >
                {index === 0 && (
                  <span className="product-badge">
                    Destaque
                  </span>
                )}

                {index === 1 && (
                  <span className="product-badge">
                    Mais Vendido
                  </span>
                )}

                <button className="favorite-btn" type="button">
                  ♡
                </button>

                <div className="product-icon">
                  {obterEmojiCategoria(obterCategoria(anuncio))}
                </div>

                <h3>
                  {obterNomeProduto(anuncio)}
                </h3>

                <p>
                  {obterFornecedor(anuncio)}
                </p>

                <strong>
                  {obterPreco(anuncio)}
                </strong>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* BENEFÍCIOS */}
      <section className="benefits-section">

        <div className="benefit-card">
          <span>🔍</span>
          <h3>Encontre Fornecedores</h3>
          <p>
            Busca avançada com filtros por categoria, região, MOQ e avaliação.
          </p>
        </div>

        <div className="benefit-card">
          <span>📋</span>
          <h3>Solicite Orçamentos</h3>
          <p>
            Descreva suas necessidades e receba propostas personalizadas dos fornecedores.
          </p>
        </div>

        <div className="benefit-card">
          <span>📊</span>
          <h3>Compare Condições</h3>
          <p>
            Veja MOQ, prazo de entrega e região de cada anúncio lado a lado.
          </p>
        </div>

        <div className="benefit-card">
          <span>📞</span>
          <h3>Contato Direto</h3>
          <p>
            Fale com o fornecedor via WhatsApp ou e-mail, sem taxas.
          </p>
        </div>

      </section>

      {/* CTA FINAL */}
      <section className="cta-section">

        <span className="section-pill">COMECE AGORA</span>

        <h2>Pronto para reabastecer seu negócio?</h2>

        <p>
          Cadastre-se gratuitamente como comprador ou anuncie seus produtos.
        </p>

        <div className="cta-buttons">

          <Link to="/marketplace" className="cta-btn orange">
            🛒 Explorar Anúncios
          </Link>

          <Link to="/marketplace" className="cta-btn yellow">
            📋 Solicitar Orçamento
          </Link>

          <Link to="/fornecedor" className="cta-btn red">
            🏭 Quero Anunciar
          </Link>

        </div>

      </section>

    </>
  )
}

export default LandingPage