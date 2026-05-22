import { useState } from 'react';
import api from '../services/api';

function AvaliarProduto({ produtoId, usuario }) {

  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState('');

  const enviar = async () => {
    try {
      await api.post('/avaliacoes', {
        produto_id: produtoId,
        usuario_id: usuario.id,
        estrelas,
        comentario
      });

      alert('Avaliação enviada com sucesso');
      setComentario('');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar avaliação');
    }
  };

  return (
    <div>
      <h3>Avaliar produto</h3>

      <select value={estrelas} onChange={e => setEstrelas(e.target.value)}>
        <option value="5">5 estrelas</option>
        <option value="4">4 estrelas</option>
        <option value="3">3 estrelas</option>
        <option value="2">2 estrelas</option>
        <option value="1">1 estrela</option>
      </select>

      <textarea
        placeholder="Escreva um comentário (opcional)"
        value={comentario}
        onChange={e => setComentario(e.target.value)}
      />

      <button onClick={enviar}>Enviar avaliação</button>
    </div>
  );
}

export default AvaliarProduto;