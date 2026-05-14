import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import ProdutoList from '../components/ProdutoList'

import api from '../services/api'

import '../styles/global.css'
import '../styles/marketplace.css'

function Home() {

  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {

    try {

      const response = await api.get('/anuncios')

      setProdutos(response.data)

    } catch (error) {

      console.error(
        'Erro ao carregar produtos:',
        error
      )

    }
  }

  // FAVORITOS

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

      alert('Produto deletado com sucesso!')

    } catch (error) {

      console.log(error)

      alert('Erro ao deletar produto')

    }
  }

  return (

    <>

      <Navbar />

      {/* MARKETPLACE */}

      <main className="marketplace-container">

        <section className="marketplace-header">

          <h1>
            Marketplace
          </h1>

          <p>
            Encontre produtos e fornecedores disponíveis.
          </p>

        </section>

        <ProdutoList
          produtos={produtos}
          adicionarFavorito={adicionarFavorito}
          deletarProduto={deletarProduto}
        />

      </main>

      {/* FOOTER */}

      <footer>

        <p>
          © 2026 Restocka • Todos os direitos reservados
        </p>

      </footer>

    </>

  )
}

export default Home