import { useEffect, useState } from 'react'
import api from '../services/api'

function UsuariosAdmin() {

  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function carregarUsuarios() {
    try {
      const response = await api.get('/usuarios')
      setUsuarios(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  async function excluirUsuario(id) {

    const confirmar = window.confirm('Deseja excluir este usuário?')

    if (!confirmar) return

    try {
      await api.delete(`/usuarios/${id}`)

      alert('Usuário excluído com sucesso')

      carregarUsuarios()

    } catch (error) {
      console.error(error)
      alert('Erro ao excluir usuário')
    }
  }

  return (
    <div style={{ padding: '20px' }}>

      <h1>Usuários</h1>

      {usuarios.length === 0 && (
        <p>Nenhum usuário encontrado.</p>
      )}

      {usuarios.map((user) => (
        <div
          key={user.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '8px'
          }}
        >

          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tipo:</strong> {user.role}</p>

          {user.role !== 'admin' ? (

  <button
    style={{
      background: 'red',
      color: '#fff',
      border: 'none',
      padding: '8px',
      cursor: 'pointer'
    }}
    onClick={() => excluirUsuario(user.id)}
  >
    Excluir
  </button>

) : (

  <p style={{ color: 'gray' }}>
    Admin não pode ser removido
  </p>

)}

        </div>
      ))}

    </div>
  )
}

export default UsuariosAdmin