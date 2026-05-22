import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import api from '../services/api'

import '../styles/global.css'
import '../styles/home.css'

function Home() {
  const navigate = useNavigate()

  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      const response = await api.get('/anuncios')
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    }
  }

  function obterCategoria(produto) {
    return (
      produto.categoria_nome ||
      produto.categoria ||
      produto.nome_categoria ||
      'Sem categoria'
    )
  }

  function obterIconeCategoria(nomeCategoria) {
    if (nomeCategoria === 'Castanhas') return '🥜'
    if (nomeCategoria === 'Bebidas') return '🥤'
    if (nomeCategoria === 'Doces') return '🍫'
    if (nomeCategoria === 'Snacks') return '🍪'
    if (nomeCategoria === 'Congelados') return '🧊'

    return '📦'
  }

  const categoriasPopulares = useMemo(() => {
    const mapa = {}

    produtos.forEach((produto) => {
      const categoria = obterCategoria(produto)

      if (
        !categoria ||
        categoria === 'Categoria Teste' ||
        categoria === 'Sem categoria'
      ) {
        return
      }

      if (!mapa[categoria]) {
        mapa[categoria] = {
          nome: categoria,
          icone: obterIconeCategoria(categoria),
          total: 0
        }
      }

      mapa[categoria].total += 1
    })

    return Object.values(mapa).slice(0, 4)
  }, [produtos])

  function buscarProdutos() {
    const termo = busca.trim()

    if (!termo) {
      navigate('/marketplace')
      return
    }

    navigate(`/marketplace?busca=${encodeURIComponent(termo)}`)
  }

  function buscarComEnter(event) {
    if (event.key === 'Enter') {
      buscarProdutos()
    }
  }

  return (
    <>
      <Navbar />

      <section className="hero">

        <div className="glow"></div>

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
              type="text"
              placeholder="Buscar chips, castanhas, bebidas..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              onKeyDown={buscarComEnter}
            />

            <button
              type="button"
              onClick={buscarProdutos}
            >
              Buscar
            </button>

          </div>

        </div>

        <div className="glass-card">

          <h2>
            CATEGORIAS POPULARES
          </h2>

          <div className="grid">

            {categoriasPopulares.length === 0 && (
              <div className="cat-box">
                <span>📦</span>
                <p>Nenhuma categoria</p>
              </div>
            )}

            {categoriasPopulares.map((categoria) => (
              <div
                key={categoria.nome}
                className="cat-box"
              >
                <span>{categoria.icone}</span>
                <p>{categoria.nome}</p>
              </div>
            ))}

          </div>

        </div>

      </section>
    </>
  )
}

export default Home