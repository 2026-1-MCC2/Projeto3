import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'

import '../styles/global.css'
import '../styles/marketplace.css'

function Favoritos() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const [produtosFavoritos, setProdutosFavoritos] =
    useState([])

  const [fornecedoresFavoritos, setFornecedoresFavoritos] =
    useState([])

  useEffect(() => {

    if (!usuario) {

      navigate('/login')

      return

    }

    carregarFavoritos()

  }, [])

  async function carregarFavoritos() {

    try {

      const produtosResponse =
        await api.get(
          `/favoritos/produtos/${usuario.id}`
        )

      const fornecedoresResponse =
        await api.get(
          `/favoritos/fornecedores/${usuario.id}`
        )

      setProdutosFavoritos(produtosResponse.data)

      setFornecedoresFavoritos(fornecedoresResponse.data)

    } catch (error) {

      console.error(error)

      alert('Erro ao carregar favoritos')

    }

  }

  async function removerProdutoFavorito(produtoId) {

    try {

      await api.delete(
        `/favoritos/produto/${usuario.id}/${produtoId}`
      )

      alert('Produto removido dos favoritos')

      carregarFavoritos()

    } catch (error) {

      console.error(error)

      alert('Erro ao remover produto favorito')

    }

  }

  async function removerFornecedorFavorito(fornecedorId) {

    try {

      await api.delete(
        `/favoritos/fornecedor/${usuario.id}/${fornecedorId}`
      )

      alert('Fornecedor removido dos favoritos')

      carregarFavoritos()

    } catch (error) {

      console.error(error)

      alert('Erro ao remover fornecedor favorito')

    }

  }

  return (

    <>

      <Navbar />

      <main className="marketplace-container">

        <section className="marketplace-header">

          <h1>
            Meus Favoritos
          </h1>

          <p>
            Anúncios e fornecedores salvos.
          </p>

        </section>

        <section className="card">

          <h2>
            Anúncios favoritos
          </h2>

          {produtosFavoritos.length === 0 ? (

            <p>
              Nenhum anúncio favoritado.
            </p>

          ) : (

            <section className="products-grid">

              {produtosFavoritos.map((produto) => (

                <article
                  key={produto.id}
                  className="product-card"
                >

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
                    {produto.descricao}
                  </p>

                  <p>
                    <strong>
                      Fornecedor:
                    </strong>
                    {' '}
                    {produto.fornecedor_nome || 'Não informado'}
                  </p>

                  <strong>
                    {produto.preco
                      ? `R$ ${Number(produto.preco).toFixed(2)}`
                      : 'Preço sob consulta'}
                  </strong>

                  <button
                    className="btn-outline"
                    onClick={() =>
                      removerProdutoFavorito(produto.id)
                    }
                  >
                    Remover favorito
                  </button>

                </article>

              ))}

            </section>

          )}

        </section>

        <section className="card">

          <h2>
            Fornecedores favoritos
          </h2>

          {fornecedoresFavoritos.length === 0 ? (

            <p>
              Nenhum fornecedor favoritado.
            </p>

          ) : (

            fornecedoresFavoritos.map((fornecedor) => (

              <div
                key={fornecedor.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}
              >

                <h3>
                  {fornecedor.nome_empresa}
                </h3>

                <p>
                  Região: {fornecedor.regiao || 'Não informada'}
                </p>

                <p>
                  WhatsApp: {fornecedor.whatsapp || 'Não informado'}
                </p>

                <p>
                  E-mail: {fornecedor.email_contato || 'Não informado'}
                </p>

                <button
                  className="btn-outline"
                  onClick={() =>
                    removerFornecedorFavorito(fornecedor.id)
                  }
                >
                  Remover fornecedor
                </button>

              </div>

            ))

          )}

        </section>

      </main>

    </>

  )

}

export default Favoritos