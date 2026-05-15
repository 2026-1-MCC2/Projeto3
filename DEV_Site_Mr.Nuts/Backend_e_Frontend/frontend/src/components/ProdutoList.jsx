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
    const marca = produto.marca || ''
    const fornecedor = produto.fornecedor_nome || produto.fornecedor || ''

    return (
      nome.toLowerCase().includes(textoBusca) ||
      descricao.toLowerCase().includes(textoBusca) ||
      marca.toLowerCase().includes(textoBusca) ||
      fornecedor.toLowerCase().includes(textoBusca)
    )

  })

  return (

    <>

      <div className="search-container">

        <input
          type="text"
          placeholder="Buscar por produto, marca ou fornecedor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />

      </div>

      {produtosFiltrados.length === 0 ? (

        <p className="empty-message">
          Nenhum produto encontrado.
        </p>

      ) : (

        <section className="products-grid">

          {produtosFiltrados.map((produto) => (

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
                  Marca:
                </strong>
                {' '}
                {produto.marca || 'Não informada'}
              </p>

              <p>
                <strong>
                  Fornecedor:
                </strong>
                {' '}
                {produto.fornecedor_nome || produto.fornecedor || 'Não informado'}
              </p>

              <strong>
                {produto.preco
                  ? `R$ ${Number(produto.preco).toFixed(2)}`
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
                  marginTop: '10px'
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
                  marginTop: '10px'
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

      )}

    </>

  )
}

export default ProdutoList