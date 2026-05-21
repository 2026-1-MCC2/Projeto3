import { useEffect, useState } from 'react'
import api from '../services/api'

function ProdutosAdmin() {

  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      const response = await api.get('/anuncios')
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    }
  }

  async function excluirProduto(id) {

    const confirmar = window.confirm(
      'Deseja excluir este produto?'
    )

    if (!confirmar) return

    try {
      await api.delete(`/anuncios/${id}`)

      alert('Produto excluído com sucesso')

      carregarProdutos()

    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao excluir produto'
      )
    }
  }

  return (
    <div style={{ padding: '20px' }}>

      <h1>Produtos</h1>

      {produtos.length === 0 && (
        <p>Nenhum produto encontrado.</p>
      )}

      {produtos.map((produto) => (
        <div
          key={produto.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '8px'
          }}
        >

          <p><strong>ID:</strong> {produto.id}</p>
          <p><strong>Nome:</strong> {produto.nome}</p>
          <p><strong>Descrição:</strong> {produto.descricao}</p>
          <p><strong>Status:</strong> {produto.status}</p>

          <button
            style={{
              background: 'red',
              color: '#fff',
              border: 'none',
              padding: '8px',
              cursor: 'pointer'
            }}
            onClick={() => excluirProduto(produto.id)}
          >
            Excluir
          </button>

        </div>
      ))}

    </div>
  )
}

export default ProdutosAdmin