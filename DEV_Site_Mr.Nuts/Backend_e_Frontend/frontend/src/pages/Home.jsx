import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import ProdutoList from '../components/ProdutoList'

import api from '../services/api'

import '../styles/global.css'
import '../styles/marketplace.css'

function Home() {

  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

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

      console.error('Erro ao carregar produtos:', error)

      setErro('Erro ao carregar produtos do banco de dados.')

    } finally {

      setLoading(false)

    }

  }

  async function adicionarFavorito(produto) {

    const usuario = JSON.parse(
      localStorage.getItem('usuario')
    )

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

    const usuario = JSON.parse(
      localStorage.getItem('usuario')
    )

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

  async function deletarProduto(id) {

    const confirmar = confirm(
      'Deseja excluir este produto?'
    )

    if (!confirmar) {
      return
    }

    try {

      await api.delete(`/anuncios/${id}`)

      alert('Produto deletado com sucesso!')

      carregarProdutos()

    } catch (error) {

      console.error(error)

      alert('Erro ao deletar produto')

    }

  }

  return (

    <>

      <Navbar />

      <main className="marketplace-container">

        <section className="marketplace-header">

          <h1>
            Marketplace
          </h1>

          <p>
            Produtos cadastrados no banco de dados.
          </p>

        </section>

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

        {!loading && !erro && (

          <ProdutoList
            produtos={produtos}
            adicionarFavorito={adicionarFavorito}
            adicionarFornecedorFavorito={adicionarFornecedorFavorito}
            deletarProduto={deletarProduto}
          />

        )}

      </main>

      <footer>

        <p>
          © 2026 Restocka • Todos os direitos reservados
        </p>

      </footer>

    </>

  )

}

export default Home