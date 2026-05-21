import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import AvaliarProduto from '../components/AvaliarProduto';
import '../styles/produto.css';

function Produto() {

  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    async function carregarProduto() {
      const res = await api.get(`/anuncios/${id}`);
      setProduto(res.data);
    }
    carregarProduto();
  }, [id]);

  useEffect(() => {
    async function carregarAvaliacoes() {
      const res = await api.get(`/avaliacoes/produto/${id}`);
      setAvaliacoes(res.data);
    }
    carregarAvaliacoes();
  }, [id]);

  if (!produto) return <p>Carregando...</p>;

  return (
    <div className="produto-page">

      {/* ✅ CARD PRODUTO */}
      <div className="produto-card">

        <div className="produto-header">

          <div className="produto-info">

            <h1>{produto.nome}</h1>

            <p className="produto-descricao">
              {produto.descricao}
            </p>

            <p className="produto-preco">
              R$ {produto.preco}
            </p>

          </div>

          {produto.imagem && (
            <img 
              src={`http://localhost:3000/uploads/${produto.imagem}`}
              className="produto-imagem"
              alt="Produto"
            />
          )}

        </div>

      </div>

      {/* ✅ FORM AVALIAÇÃO */}
      {usuario && (
        <div className="avaliacao-box">
          <h2>Avaliar produto</h2>

          <AvaliarProduto 
            produtoId={produto.id} 
            usuario={usuario}
          />
        </div>
      )}

      {/* ✅ LISTA DE AVALIAÇÕES */}
      <div className="avaliacoes-lista">

        <h2>Avaliações</h2>

        {avaliacoes.length === 0 && (
          <p className="sem-avaliacao">
            Nenhuma avaliação ainda.
          </p>
        )}

        {avaliacoes.map(av => (
          <div key={av.id} className="avaliacao-item">

            <div className="avaliacao-topo">

              <span className="avaliacao-nome">
                {av.nome}
              </span>

              <span className="avaliacao-estrelas">
                {'⭐'.repeat(av.estrelas)}
              </span>

            </div>

            {av.comentario && (
              <p className="avaliacao-comentario">
                {av.comentario}
              </p>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default Produto;