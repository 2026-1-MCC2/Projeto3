import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import ProdutoList from '../components/ProdutoList'

import api from '../services/api'

import '../styles/global.css'
import '../styles/marketplace.css'

function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  const parametros = new URLSearchParams(location.search)
  const buscaInicial = parametros.get('busca') || ''

  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const [busca, setBusca] = useState(buscaInicial)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [regiaoSelecionada, setRegiaoSelecionada] = useState('')
  const [moqMaximo, setMoqMaximo] = useState(5000)

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      setLoading(true)
      const response = await api.get('/anuncios')
      setProdutos(response.data)
      setErro('')
    } catch (error) {
      console.error(error)
      setErro('Erro ao carregar produtos do banco de dados.')
    } finally {
      setLoading(false)
    }
  }

  // 🔎 FILTRO SIMPLIFICADO (mantido)
  const produtosFiltrados = useMemo(() => {
    return produtos
  }, [produtos])

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  function abrirProduto(id) {
    navigate(`/produto/${id}`)
  }

  return (
    <>
      <Navbar />

      <main className="marketplace-page">

        <section className="marketplace-top">
          <h1>📦 Anúncios de Produtos</h1>
        </section>

        <section className="marketplace-content">

          <section className="marketplace-results">

            {loading && <p>Carregando...</p>}
            {erro && <p>{erro}</p>}

            {!loading && produtosFiltrados.map((produto) => (

              <div key={produto.id} className="produto-card">

                <h3>{produto.nome}</h3>

                <p>{produto.descricao}</p>

                <p><strong>R$ {produto.preco}</strong></p>

                {/* ✅ BOTÃO VER PRODUTO */}
                <button onClick={() => abrirProduto(produto.id)}>
                  Ver Produto
                </button>

                {/* ✅ BOTÃO AVALIAR (APENAS CLIENTE) */}
                {usuario && usuario.role === 'buyer' && (
                  <button
                    onClick={() => abrirProduto(produto.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Avaliar
                  </button>
                )}

              </div>

            ))}

          </section>

        </section>

      </main>
    </>
  )
}

export default Home