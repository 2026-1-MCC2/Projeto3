import { useEffect, useState } from 'react'
import api from '../services/api'

// IMPORTAR O CSS
import '../styles/dashboard.css'

function Dashboard() {

  const [cadastros, setCadastros] = useState([])
  const [anuncios, setAnuncios] = useState([])
  const [avaliacoes, setAvaliacoes] = useState([])

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const r1 = await api.get('/anuncios/relatorio/cadastros')
      const r2 = await api.get('/anuncios/relatorio/anuncios-status')
      const r3 = await api.get('/anuncios/relatorio/avaliacoes')

      setCadastros(r1.data)
      setAnuncios(r2.data)
      setAvaliacoes(r3.data)

    } catch (error) {
      console.log('Erro ao carregar dados:', error)
    }
  }

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">📊 Dashboard</h1>

      <div className="dashboard-grid">

        {/* CADASTRO */}
        <div className="dashboard-card">
          <h2>📊 Cadastro por período</h2>

          {cadastros.length === 0 ? (
            <p>Sem dados</p>
          ) : (
            cadastros.map((c, i) => (
              <p key={i}>
                {c.data.split('T')[0]} → <b>{c.total}</b>
              </p>
            ))
          )}
        </div>

        {/* ANÚNCIOS */}
        <div className="dashboard-card">
          <h2>📦 Anúncios por status</h2>

          {anuncios.length === 0 ? (
            <p>Sem dados</p>
          ) : (
            anuncios.map((a, i) => (
              <p key={i}>
                {a.status} → <b>{a.total}</b>
              </p>
            ))
          )}
        </div>

        {/* AVALIAÇÕES */}
        <div className="dashboard-card">
          <h2>⭐ Média de avaliações</h2>

          {avaliacoes.length === 0 ? (
            <p>Sem avaliações ainda</p>
          ) : (
            avaliacoes.map((a, i) => (
              <p key={i}>
                Produto {a.produto_id} → <b>{Number(a.media).toFixed(2)}</b>
              </p>
            ))
          )}
        </div>

      </div>

    </div>
  )
}

export default Dashboard