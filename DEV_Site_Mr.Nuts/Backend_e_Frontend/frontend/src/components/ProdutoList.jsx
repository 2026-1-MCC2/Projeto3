import { useNavigate } from 'react-router-dom';

function ProdutoList({
  produtos,
  adicionarFavorito,
  adicionarFornecedorFavorito
}) {

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  function abrirProduto(id) {
    navigate(`/produto/${id}`);
  }

  function formatarPreco(preco) {
    if (!preco) return 'Preço sob consulta';

    const precoNumerico = Number(preco);
    if (Number.isNaN(precoNumerico)) return 'Preço sob consulta';

    return precoNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function obterCategoria(produto) {
    return (
      produto.categoria_nome ||
      produto.categoria ||
      produto.nome_categoria ||
      'Não informada'
    );
  }

  function obterFornecedor(produto) {
    return (
      produto.fornecedor_nome ||
      produto.nome_empresa ||
      produto.fornecedor ||
      'Fornecedor não informado'
    );
  }

  function obterRegiao(produto) {
    return (
      produto.regiao ||
      produto.estado ||
      produto.localizacao ||
      produto.cidade ||
      'Nacional'
    );
  }

  function obterMoq(produto) {
    return (
      produto.moq ||
      produto.quantidade_minima ||
      produto.moq_minimo ||
      'Não informado'
    );
  }

  function obterEmojiProduto(produto) {
    const categoria = String(obterCategoria(produto)).toLowerCase();
    const nome = String(produto.nome || '').toLowerCase();

    if (categoria.includes('chip') || nome.includes('chip')) return '🍟';
    if (categoria.includes('castanha') || nome.includes('amendoim')) return '🥜';
    if (categoria.includes('bebida') || nome.includes('suco')) return '🥤';
    if (categoria.includes('ingrediente')) return '🧂';
    if (categoria.includes('congelado')) return '🧊';

    return '📦';
  }

  function obterClasseImagem(produto) {
    const categoria = String(obterCategoria(produto)).toLowerCase();

    if (categoria.includes('bebida')) return 'blue';
    if (categoria.includes('ingrediente')) return 'green';
    if (categoria.includes('castanha')) return 'yellow';

    return 'cream';
  }

  if (produtos.length === 0) {
    return (
      <p className="empty-message">
        Nenhum produto encontrado com esses filtros.
      </p>
    );
  }

  return (
    <section className="products-grid">

      {produtos.map((produto) => (
        <article key={produto.id} className="product-card">

          <button
            type="button"
            className="favorite-circle"
            onClick={() => adicionarFavorito(produto)}
            title="Favoritar anúncio"
          >
            ♡
          </button>

          <div className={`product-image-box ${obterClasseImagem(produto)}`}>
            {produto.imagem ? (
              <img
                src={`http://localhost:3000/uploads/${produto.imagem}`}
                alt={produto.nome || 'Produto'}
                className="product-real-image"
              />
            ) : (
              <span className="product-emoji">
                {obterEmojiProduto(produto)}
              </span>
            )}
          </div>

          <div className="product-info">

            <h3>{produto.nome || 'Produto sem nome'}</h3>

            <p className="supplier-name">
              🏭 {obterFornecedor(produto)}
            </p>

            {produto.descricao && (
              <p className="product-description">
                {produto.descricao}
              </p>
            )}

            <p className="moq-text-card">
              MOQ: <strong>{obterMoq(produto)} un</strong>
            </p>

            <div className="product-tags-row">

              <span className="product-tag">
                {obterCategoria(produto)}
              </span>

              <span className="product-tag">
                📍 {obterRegiao(produto)}
              </span>

            </div>

            <strong className="product-price">
              {formatarPreco(produto.preco)}
            </strong>

            <div className="product-actions">

              <button
                type="button"
                className="btn-budget"
              >
                📋 Orçamento
              </button>

              <button
                type="button"
                className="btn-contact"
                onClick={() => adicionarFornecedorFavorito(produto)}
              >
                📞 Contato
              </button>

              {/* ✅ NOVOS BOTÕES */}

              <button
                type="button"
                onClick={() => abrirProduto(produto.id)}
              >
                Ver Produto
              </button>

              {usuario && usuario.role === 'buyer' && (
                <button
                  type="button"
                  onClick={() => abrirProduto(produto.id)}
                >
                  Avaliar
                </button>
              )}

            </div>

          </div>

        </article>
      ))}

    </section>
  );
}

export default ProdutoList;