import { useState } from 'react'

import { Link } from 'react-router-dom'

function ProdutoList({
  produtos,
  adicionarFavorito,
  deletarProduto
}) {

  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [regiao, setRegiao] = useState('')
  const [moq, setMoq] = useState('')
  const [fornecedor, setFornecedor] = useState('')

  const categorias = [
    ...new Set(
      produtos
        .map((produto) => produto.categoria_nome)
        .filter(Boolean)
    )
  ]

  const regioes = [
    ...new Set(
      produtos
        .map((produto) => produto.regiao)
        .filter(Boolean)
    )
  ]

  const fornecedores = [
    ...new Set(
      produtos
        .map((produto) => produto.fornecedor_nome)
        .filter(Boolean)
    )
  ]

  const produtosFiltrados = produtos.filter((produto) => {

    const textoBusca = busca.toLowerCase()

    const nomeProduto = produto.nome || ''
    const descricaoProduto = produto.descricao || ''
    const marcaProduto = produto.marca || ''
    const fornecedorProduto = produto.fornecedor_nome || ''
    const categoriaProduto = produto.categoria_nome || ''
    const regiaoProduto = produto.regiao || ''
    const moqProduto = Number(produto.moq || 0)

    const passouBusca =
      nomeProduto.toLowerCase().includes(textoBusca) ||
      descricaoProduto.toLowerCase().includes(textoBusca) ||
      marcaProduto.toLowerCase().includes(textoBusca) ||
      fornecedorProduto.toLowerCase().includes(textoBusca)

    const passouCategoria =
      categoria === '' ||
      categoriaProduto === categoria

    const passouRegiao =
      regiao === '' ||
      regiaoProduto === regiao

    const passouFornecedor =
      fornecedor === '' ||
      fornecedorProduto === fornecedor

    const passouMoq =
      moq === '' ||
      moqProduto <= Number(moq)

    return (
      passouBusca &&
      passouCategoria &&
      passouRegiao &&
      passouFornecedor &&
      passouMoq
    )

  })

  function limparFiltros() {

    setBusca('')
    setCategoria('')
    setRegiao('')
    setMoq('')
    setFornecedor('')

  }

  return (

    <>

      {/* FILTROS */}

      <div className="filters-container">

        <input
          type="text"
          placeholder="Buscar por produto, marca ou fornecedor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="filter-select"
        >

          <option value="">
            Todas as categorias
          </option>

          {categorias.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

        <select
          value={regiao}
          onChange={(e) => setRegiao(e.target.value)}
          className="filter-select"
        >

          <option value="">
            Todas as regiões
          </option>

          {regioes.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

        <select
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
          className="filter-select"
        >

          <option value="">
            Todos os fornecedores
          </option>

          {fornecedores.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

        <input
          type="number"
          placeholder="MOQ máximo"
          value={moq}
          onChange={(e) => setMoq(e.target.value)}
          className="filter-input"
        />

        <button
          type="button"
          onClick={limparFiltros}
          className="filter-clear"
        >
          Limpar filtros
        </button>

      </div>

      {/* RESULTADO */}

      {produtosFiltrados.length === 0 ? (

        <p className="empty-message">
          Nenhum produto encontrado com esses filtros.
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
                  Categoria:
                </strong>
                {' '}
                {produto.categoria_nome || 'Não informada'}
              </p>

              <p>
                <strong>
                  Região:
                </strong>
                {' '}
                {produto.regiao || 'Não informada'}
              </p>

              <p>
                <strong>
                  MOQ:
                </strong>
                {' '}
                {produto.moq || 'Não informado'}
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