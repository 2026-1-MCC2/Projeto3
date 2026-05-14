import { useState } from 'react'
import { Link } from 'react-router-dom'

function ProdutoList({
  produtos,
  adicionarFavorito,
  deletarProduto
}) {

  const [busca, setBusca] = useState('')

  const produtosFiltrados = produtos.filter((produto) => {

    const textoBusca = busca.toLowerCase()

    const nome = produto.nome || ''
    const descricao = produto.descricao || ''

    return (
      nome.toLowerCase().includes(textoBusca) ||
      descricao.toLowerCase().includes(textoBusca)
    )

  })

  return (

    <>

      <div className="search-container">

        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
          className="search-input"
        />

      </div>

      <section className="products-grid">

        {produtosFiltrados.map((produto) => (

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
              {produto.descricao}
            </p>

            <strong>

              {produto.preco
                ? `R$ ${produto.preco}`
                : 'Preço sob consulta'}

            </strong>

            <Link
              to={`/editar/${produto.id}`}
              className="btn-primary"
            >
              Editar Produto
            </Link>

            <button
              className="btn-primary"
              style={{
                marginTop: '10px',
                width: '100%'
              }}
              onClick={() =>
                adicionarFavorito(produto)
              }
            >
              Favoritar
            </button>

            <button
              className="btn-outline"
              style={{
                marginTop: '10px',
                width: '100%'
              }}
              onClick={() =>
                deletarProduto(produto.id)
              }
            >
              Excluir
            </button>

          </article>

        ))}

      </section>

    </>

  )
}

export default ProdutoList