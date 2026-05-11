import { useEffect, useState } from 'react'

import {
  useNavigate,
  Link
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'

import '../styles/global.css'
import '../styles/marketplace.css'

function Cliente() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const [produtos, setProdutos] = useState([])

  // PROTEÇÃO

  useEffect(() => {

    if (!usuario || usuario.role !== 'buyer') {

      alert('Acesso negado')

      navigate('/login')

      return

    }

    carregarProdutos()

  }, [])

  // CARREGAR PRODUTOS

  async function carregarProdutos() {

    try {

      const response =
        await api.get('/anuncios')

      setProdutos(response.data)

    } catch (error) {

      console.error(
        'Erro ao carregar produtos:',
        error
      )

    }
  }

  // FAVORITO

  function adicionarFavorito(id) {

    const produto = produtos.find(
      (p) => p.id === id
    )

    if (!produto) return

    let favoritos = JSON.parse(
      localStorage.getItem('favoritos')
    ) || []

    const existe = favoritos.find(
      (p) => p.id === id
    )

    if (existe) {

      alert(
        'Produto já está nos favoritos'
      )

      return

    }

    favoritos.push(produto)

    localStorage.setItem(
      'favoritos',
      JSON.stringify(favoritos)
    )

    alert(
      'Produto adicionado aos favoritos'
    )
  }

  // CONFIG

  function irConfig() {

    navigate('/cliente-config')

  }

  // ORÇAMENTO

  function solicitar(id) {

    alert(
      `Solicitar orçamento do produto ID: ${id}`
    )

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

            Bem-vindo,
            {' '}
            <strong>
              {usuario?.nome}
            </strong>

          </p>

        </section>

        <section
          id="produtos"
          className="products-grid"
        >

          {produtos.length === 0 ? (

            <p>
              Nenhum produto disponível.
            </p>

          ) : (

            produtos.map((produto) => (

              <article
                key={produto.id}
                className="product-card"
              >

                {/* IMAGEM */}

                {produto.imagem ? (

                  <img
                    src={`http://localhost:3000/uploads/${produto.imagem}`}
                    alt={produto.nome}
                    className="product-image"
                  />

                ) : (

                  <div className="product-image"></div>

                )}

                <h3>
                  {produto.nome}
                </h3>

                <p>

                  Fornecedor:
                  {' '}

                  {
                    produto.fornecedor_nome ||
                    'Não informado'
                  }

                </p>

                <strong>

                  {
                    produto.preco
                      ? `R$ ${produto.preco}`
                      : ''
                  }

                </strong>

                <button
                  onClick={() =>
                    adicionarFavorito(
                      produto.id
                    )
                  }
                >
                  Favoritar
                </button>

                <button
                  className="btn-primary"
                  onClick={() =>
                    solicitar(produto.id)
                  }
                >
                  Solicitar orçamento
                </button>

              </article>

            ))

          )}

        </section>

      </main>

      <footer>

        <p>
          © 2026 Restocka • Todos os direitos reservados
        </p>

      </footer>

    </>

  )
}

export default Cliente