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

  // ✅ CARREGAR PRODUTO
  useEffect(() => {
    async function carregarProduto() {
      try {
        const res = await api.get(`/anuncios/${id}`);
        setProduto(res.data);
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
      }
    }

    carregarProduto();
  }, [id]);


  // ✅ CARREGAR AVALIAÇÕES
  useEffect(() => {
    async function carregarAvaliacoes() {
      try {
        const res = await api.get(`/avaliacoes/produto/${id}`);
        setAvaliacoes(res.data);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
      }
    }

    carregarAvaliacoes();
  }, [id]);


  if (!produto) return <p>Carregando...</p>;


  return (
    <div style={{ padding: '20px' }}>

      <h1>{produto.nome}</h1>

      <p>{produto.descricao}</p>

      <p><strong>Preço:</strong> R$ {produto.preco}</p>

      {produto.imagem && (
        <img 
          src={`http://localhost:3000/uploads/${produto.imagem}`} 
          width="200"
        />
      )}

      <hr />

      {/* ✅ FORMULÁRIO DE AVALIAÇÃO */}
      {usuario && (
        <AvaliarProduto 
          produtoId={produto.id} 
          usuario={usuario}
        />
      )}

      <hr />

      {/* ✅ LISTA DE AVALIAÇÕES */}
      <h3>Avaliações</h3>

      {avaliacoes.length === 0 && <p>Nenhuma avaliação ainda.</p>}

      {avaliacoes.map(av => (
        <div key={av.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
          
          <p><strong>{av.nome}</strong></p>

          <p>⭐ {av.estrelas} / 5</p>

          <p>{av.comentario}</p>

        </div>
      ))}

    </div>
  );
}

export default Produto;