import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

function EditarProduto() {

  const { id } = useParams()

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    buscarProduto()
  }, [])

  async function buscarProduto() {

    try {

      const response = await api.get(`/anuncios/${id}`)

      setNome(response.data.nome)
      setDescricao(response.data.descricao)

    } catch (error) {

      console.log(error)

    }
  }

  async function atualizarProduto(e) {

    e.preventDefault()

    try {

      await api.put(`/anuncios/${id}`, {
        nome,
        descricao,
        marca: 'Teste',
        moq: 1
      })

      alert('Produto atualizado com sucesso!')

    } catch (error) {

      console.log(error)

      alert('Erro ao atualizar produto')

    }
  }

  return (

    <div className="container mt-5">

      <h1>Editar Produto</h1>

      <form onSubmit={atualizarProduto}>

        <input
          type="text"
          className="form-control mb-3"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button className="btn btn-warning">
          Atualizar
        </button>

      </form>

    </div>

  )
}

export default EditarProduto
