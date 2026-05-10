import { useState } from 'react'
import api from '../services/api'

function NovoProduto() {

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      await api.post('/anuncios', {
        nome: nome,
        descricao: descricao,
        fornecedor_id: 1,
        marca: 'Teste',
        moq: 1,
        preco: 10
      })

      alert('Anúncio criado com sucesso!')

      setNome('')
      setDescricao('')

    } catch (error) {

      console.log(error)

      if (error.response) {
        alert(JSON.stringify(error.response.data))
      } else {
        alert('Erro geral')
      }
    }
  }

  return (
    <div className="container mt-5">

      <h1>Novo Anúncio</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Nome"
          className="form-control mb-3"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <textarea
          placeholder="Descrição"
          className="form-control mb-3"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          Cadastrar
        </button>

      </form>

    </div>
  )
}

export default NovoProduto

