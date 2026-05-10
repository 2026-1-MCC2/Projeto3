import { useEffect, useState } from 'react'
import api from '../services/api'

function Home() {
  const [anuncios, setAnuncios] = useState([])

  useEffect(() => {
    buscarAnuncios()
  }, [])

  async function buscarAnuncios() {
    try {
      const response = await api.get('/anuncios')
      setAnuncios(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mt-5">
      <h1>Lista de Anúncios</h1>

      {anuncios.map((anuncio) => (
        <div key={anuncio.id} className="card p-3 mb-3">
          <h3>{anuncio.titulo}</h3>
          <p>{anuncio.descricao}</p>
        </div>
      ))}
    </div>
  )
}

export default Home