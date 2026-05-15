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

  function adicionarFavorito(produto) {

    let favoritos = JSON.parse(
      localStorage.getItem('favoritos')
    ) || []

    const existe = favoritos.find(
      (p) => p.id === produto.id
    )

    if (existe) {
      alert('Produto já está nos favoritos')
      return
    }

    favoritos.push(produto)

    localStorage.setItem(
      'favoritos',
      JSON.stringify(favoritos)
    )

    alert('Produto adicionado aos favoritos')
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