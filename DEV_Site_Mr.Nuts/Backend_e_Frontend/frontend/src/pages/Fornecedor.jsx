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

  // PROTEÇÃO

  useEffect(() => {

    if (!usuario || usuario.role !== 'supplier') {

      alert('Acesso negado')

      navigate('/login')

      return

    }

    carregarMeusProdutos()

  }, [])

  // CADASTRAR PRODUTO

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
  1
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
        'Produto cadastrado com sucesso'
      )

      limparFormulario()

      carregarMeusProdutos()

    } catch (error) {

      console.error(error)

      alert('Erro ao conectar com o servidor')

    }
  }

  // LIMPAR FORM

  function limparFormulario() {

    setNome('')
    setDescricao('')
    setMarca('')
    setPreco('')
    setMoq('')
    setImagem(null)

  }

  // CARREGAR PRODUTOS

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

  return (

    <>

      <Navbar />

      <main>

        <h1>
          Painel do Fornecedor
        </h1>

        {/* FORMULÁRIO */}

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
            placeholder="Preço (ex: 59,90)"
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
            type="file"
            onChange={(e) =>
              setImagem(e.target.files[0])
            }
          />

          <button onClick={cadastrarProduto}>
            Cadastrar
          </button>

        </section>

        {/* LISTA */}

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
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '8px'
                  }}
                >

                  <h4>
                    {produto.nome}
                  </h4>

                  <p>
                    {produto.descricao}
                  </p>

                  <p>

                    <strong>
                      Preço:
                    </strong>

                    {' '}
                    R$ {produto.preco || '-'}

                  </p>

                  {produto.imagem && (

                    <img
                      src={`http://localhost:3000/uploads/${produto.imagem}`}
                      width="120"
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