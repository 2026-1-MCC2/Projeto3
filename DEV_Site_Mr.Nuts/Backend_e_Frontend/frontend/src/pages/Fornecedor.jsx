import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'

import '../styles/global.css'
import '../styles/fornecedor.css'

function Fornecedor() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [marca, setMarca] = useState('')
  const [preco, setPreco] = useState('')
  const [moq, setMoq] = useState('')
  const [imagem, setImagem] = useState(null)

  const [produtos, setProdutos] = useState([])
  const [orcamentos, setOrcamentos] = useState([])

  useEffect(() => {

    if (!usuario || usuario.role !== 'supplier') {

      alert('Acesso negado')

      navigate('/login')

      return

    }

    carregarMeusProdutos()
    carregarOrcamentosRecebidos()

  }, [])

  async function cadastrarProduto() {

    if (!nome || !descricao) {

      alert('Preencha nome e descrição')

      return

    }

    if (preco && isNaN(preco.replace(',', '.'))) {

      alert('Preço inválido')

      return

    }

    const formData = new FormData()

    formData.append('nome', nome)
    formData.append('descricao', descricao)
    formData.append('marca', marca)

    formData.append(
      'preco',
      preco.replace(',', '.')
    )

    formData.append('moq', moq)

    formData.append(
      'fornecedor_id',
      usuario.id
    )

    if (imagem) {

      formData.append('imagem', imagem)

    }

    try {

      const response = await api.post(
        '/anuncios',
        formData
      )

      alert(
        response.data.mensagem ||
        'Produto enviado para aprovação'
      )

      limparFormulario()

      carregarMeusProdutos()

    } catch (error) {

      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao cadastrar produto'
      )

    }

  }

  function limparFormulario() {

    setNome('')
    setDescricao('')
    setMarca('')
    setPreco('')
    setMoq('')
    setImagem(null)

    const inputImagem =
      document.getElementById('imagem-produto')

    if (inputImagem) {

      inputImagem.value = ''

    }

  }

  async function carregarMeusProdutos() {

    try {

      const resposta = await api.get(
        `/anuncios/fornecedor/${usuario.id}`
      )

      setProdutos(resposta.data)

    } catch (error) {

      console.error(
        'Erro ao carregar produtos:',
        error
      )

    }

  }

  async function carregarOrcamentosRecebidos() {

    try {

      const response = await api.get(
        `/orcamentos/fornecedor/${usuario.id}`
      )

      setOrcamentos(response.data)

    } catch (error) {

      console.error(
        'Erro ao carregar orçamentos:',
        error
      )

    }

  }

  async function responderOrcamento(id) {

    const resposta =
      prompt('Digite sua resposta para o cliente:')

    if (!resposta) {

      return

    }

    try {

      const response = await api.patch(
        `/orcamentos/${id}/responder`,
        {
          resposta
        }
      )

      alert(
        response.data.mensagem ||
        'Orçamento respondido com sucesso'
      )

      carregarOrcamentosRecebidos()

    } catch (error) {

      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao responder orçamento'
      )

    }

  }

  function formatarStatus(status) {

    if (status === 'pending') {
      return 'Pendente'
    }

    if (status === 'responded') {
      return 'Respondido'
    }

    if (status === 'closed') {
      return 'Fechado'
    }

    if (status === 'cancelled') {
      return 'Cancelado'
    }

    return status || 'Não informado'

  }

  return (

    <>

      <Navbar />

      <main>

        <h1>
          Painel do Fornecedor
        </h1>

        <section className="card">

          <h3>
            Cadastrar Produto
          </h3>

          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) =>
              setDescricao(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Marca"
            value={marca}
            onChange={(e) =>
              setMarca(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Preço base (ex: 59,90)"
            value={preco}
            onChange={(e) =>
              setPreco(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Quantidade mínima"
            value={moq}
            onChange={(e) =>
              setMoq(e.target.value)
            }
          />

          <input
            id="imagem-produto"
            type="file"
            onChange={(e) =>
              setImagem(e.target.files[0])
            }
          />

          <button onClick={cadastrarProduto}>
            Cadastrar
          </button>

        </section>

        <section className="card">

          <h3>
            Solicitações de Orçamento Recebidas
          </h3>

          {orcamentos.length === 0 ? (

            <p>
              Nenhuma solicitação de orçamento recebida.
            </p>

          ) : (

            orcamentos.map((orcamento) => (

              <div
                key={orcamento.id}
                className="fornecedor-item"
              >

                <h4>
                  {orcamento.produto_nome || orcamento.produto_nome_banco || 'Produto não informado'}
                </h4>

                <p>
                  <strong>
                    Cliente:
                  </strong>
                  {' '}
                  {orcamento.comprador_nome || 'Não informado'}
                </p>

                <p>
                  <strong>
                    Email:
                  </strong>
                  {' '}
                  {orcamento.comprador_email || 'Não informado'}
                </p>

                <p>
                  <strong>
                    Empresa:
                  </strong>
                  {' '}
                  {orcamento.empresa_nome || 'Não informado'}
                </p>

                <p>
                  <strong>
                    Quantidade:
                  </strong>
                  {' '}
                  {orcamento.quantidade || 'Não informada'}
                </p>

                <p>
                  <strong>
                    Necessidades:
                  </strong>
                  {' '}
                  {orcamento.necessidades}
                </p>

                <p>
                  <strong>
                    Frequência:
                  </strong>
                  {' '}
                  {orcamento.frequencia || 'Não informada'}
                </p>

                <p>
                  <strong>
                    Prazo desejado:
                  </strong>
                  {' '}
                  {orcamento.prazo_desejado || 'Não informado'}
                </p>

                <p>
                  <strong>
                    Região de entrega:
                  </strong>
                  {' '}
                  {orcamento.regiao_entrega || 'Não informada'}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>
                  {' '}
                  {formatarStatus(orcamento.status)}
                </p>

                {orcamento.resposta && (

                  <p>
                    <strong>
                      Resposta enviada:
                    </strong>
                    {' '}
                    {orcamento.resposta}
                  </p>

                )}

                {orcamento.status === 'pending' && (

                  <button
                    onClick={() =>
                      responderOrcamento(orcamento.id)
                    }
                  >
                    Responder orçamento
                  </button>

                )}

              </div>

            ))

          )}

        </section>

        <section className="card">

          <h3>
            Meus Produtos
          </h3>

          <div id="meusProdutos">

            {produtos.length === 0 ? (

              <p>
                Nenhum produto cadastrado.
              </p>

            ) : (

              produtos.map((produto) => (

                <div
                  key={produto.id}
                  className="fornecedor-item"
                >

                  <h4>
                    {produto.nome}
                  </h4>

                  <p>
                    {produto.descricao}
                  </p>

                  <p>
                    <strong>
                      Preço base:
                    </strong>
                    {' '}
                    R$ {produto.preco || '-'}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>
                    {' '}
                    {produto.status}
                  </p>

                  {produto.motivo_reprovacao && (

                    <p>
                      <strong>
                        Motivo da reprovação:
                      </strong>
                      {' '}
                      {produto.motivo_reprovacao}
                    </p>

                  )}

                  {produto.imagem && (

                    <img
                      src={`http://localhost:3000/uploads/${produto.imagem}`}
                      width="120"
                      alt={produto.nome}
                    />

                  )}

                </div>

              ))

            )}

          </div>

        </section>

      </main>

    </>

  )

}

export default Fornecedor