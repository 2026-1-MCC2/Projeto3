import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import api from '../services/api'
import AvaliarProduto from '../components/AvaliarProduto'

import '../styles/produto.css'

function Produto() {
  const { id } = useParams()

  const [produto, setProduto] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])

  const [empresaNome, setEmpresaNome] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [necessidades, setNecessidades] = useState('')
  const [frequencia, setFrequencia] = useState('')
  const [prazoDesejado, setPrazoDesejado] = useState('')
  const [regiaoEntrega, setRegiaoEntrega] = useState('')

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  useEffect(() => {
    carregarProduto()
    carregarAvaliacoes()
  }, [id])

  async function carregarProduto() {
    try {
      const response = await api.get(`/anuncios/${id}`)
      setProduto(response.data)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
    }
  }

  async function carregarAvaliacoes() {
    try {
      const response = await api.get(`/avaliacoes/produto/${id}`)
      setAvaliacoes(response.data)
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error)
    }
  }

  async function solicitarOrcamento() {
    if (!usuario) {
      alert('Faça login para solicitar orçamento')
      return
    }

    if (usuario.role !== 'buyer') {
      alert('Apenas clientes podem solicitar orçamento')
      return
    }

    if (!necessidades) {
      alert('Informe suas necessidades para o orçamento')
      return
    }

    try {
      await api.post('/orcamentos', {
        produto_id: produto.id,
        fornecedor_id: produto.fornecedor_id,
        comprador_id: usuario.id,
        produto_nome: produto.nome,
        fornecedor_nome: produto.fornecedor_nome,
        empresa_nome: empresaNome,
        quantidade,
        necessidades,
        frequencia,
        prazo_desejado: prazoDesejado,
        regiao_entrega: regiaoEntrega
      })

      alert('Solicitação de orçamento enviada com sucesso')

      setEmpresaNome('')
      setQuantidade('')
      setNecessidades('')
      setFrequencia('')
      setPrazoDesejado('')
      setRegiaoEntrega('')
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao solicitar orçamento'
      )
    }
  }

  if (!produto) {
    return (
      <p>
        Carregando...
      </p>
    )
  }

  return (
    <div className="produto-page">

      <div className="produto-card">
        <div className="produto-header">

          <div className="produto-info">
            <h1>
              {produto.nome}
            </h1>

            <p className="produto-descricao">
              {produto.descricao}
            </p>

            <p className="produto-preco">
              Preço base: R$ {produto.preco || 'sob consulta'}
            </p>

            <p>
              <strong>
                Fornecedor:
              </strong>
              {' '}
              {produto.fornecedor_nome || 'Não informado'}
            </p>
          </div>

          {produto.imagem && (
            <img
              src={`http://localhost:3000/uploads/${produto.imagem}`}
              className="produto-imagem"
              alt={produto.nome}
            />
          )}

        </div>
      </div>

      {usuario?.role === 'buyer' && (
        <div className="orcamento-box">
          <h2>
            Solicitar orçamento
          </h2>

          <p className="orcamento-descricao">
            Informe os detalhes da sua necessidade para que o fornecedor possa retornar com uma proposta.
          </p>

          <div className="orcamento-form">
            <input
              type="text"
              placeholder="Nome da empresa"
              value={empresaNome}
              onChange={(event) => setEmpresaNome(event.target.value)}
            />

            <input
              type="text"
              placeholder="Quantidade desejada"
              value={quantidade}
              onChange={(event) => setQuantidade(event.target.value)}
            />

            <textarea
              placeholder="Descreva suas necessidades"
              value={necessidades}
              onChange={(event) => setNecessidades(event.target.value)}
            />

            <input
              type="text"
              placeholder="Frequência de compra (ex: mensal, semanal)"
              value={frequencia}
              onChange={(event) => setFrequencia(event.target.value)}
            />

            <input
              type="text"
              placeholder="Prazo desejado"
              value={prazoDesejado}
              onChange={(event) => setPrazoDesejado(event.target.value)}
            />

            <input
              type="text"
              placeholder="Região de entrega"
              value={regiaoEntrega}
              onChange={(event) => setRegiaoEntrega(event.target.value)}
            />

            <button
              type="button"
              onClick={solicitarOrcamento}
            >
              Enviar solicitação de orçamento
            </button>
          </div>
        </div>
      )}

      {usuario && (
        <div className="avaliacao-box">
          <h2>
            Avaliar produto
          </h2>

          <AvaliarProduto
            produtoId={produto.id}
            usuario={usuario}
          />
        </div>
      )}

      <div className="avaliacoes-lista">
        <h2>
          Avaliações
        </h2>

        {avaliacoes.length === 0 && (
          <p className="sem-avaliacao">
            Nenhuma avaliação ainda.
          </p>
        )}

        {avaliacoes.map((avaliacao) => (
          <div
            key={avaliacao.id}
            className="avaliacao-item"
          >
            <div className="avaliacao-topo">
              <span className="avaliacao-nome">
                {avaliacao.nome}
              </span>

              <span className="avaliacao-estrelas">
                {'⭐'.repeat(Number(avaliacao.estrelas))}
              </span>
            </div>

            {avaliacao.comentario && (
              <p className="avaliacao-comentario">
                {avaliacao.comentario}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Produto