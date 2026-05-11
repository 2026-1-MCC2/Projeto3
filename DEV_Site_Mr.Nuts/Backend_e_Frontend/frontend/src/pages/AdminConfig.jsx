import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'

import '../styles/global.css'
import '../styles/admin-config.css'

function AdminConfig() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] =
    useState('')

  // PROTEÇÃO

  useEffect(() => {

    if (!usuario || usuario.role !== 'admin') {

      alert('Acesso negado')

      navigate('/login')

      return

    }

    // PREENCHER DADOS

    setNome(usuario.nome)
    setEmail(usuario.email)

  }, [])

  // ALTERAR CONTA

  async function alterarConta() {

    if (
      novaSenha &&
      novaSenha !== confirmarSenha
    ) {

      alert('As senhas não coincidem')

      return

    }

    try {

      const response = await api.put(
        `/auth/usuario/${usuario.id}`,
        {
          nome,
          email,
          senha: novaSenha
        }
      )

      const usuarioAtualizado = {
        ...usuario,
        nome,
        email
      }

      localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioAtualizado)
      )

      alert(
        response.data.mensagem ||
        'Dados atualizados com sucesso'
      )

    } catch (error) {

      console.error(error)

      alert('Erro ao conectar com servidor')

    }
  }

  // LOGOUT

  function logout() {

    localStorage.removeItem('usuario')

    navigate('/login')

  }

  return (

    <>

      <Navbar />

      <main>

        <h1>
          Dados da Conta
        </h1>

        {/* DADOS */}

        <section className="card">

          <h3>
            Informações básicas
          </h3>

          <label>
            Nome
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </section>

        {/* ALTERAR SENHA */}

        <section className="card">

          <h3>
            Alterar senha
          </h3>

          <label>
            Nova senha
          </label>

          <input
            type="password"
            value={novaSenha}
            onChange={(e) =>
              setNovaSenha(e.target.value)
            }
          />

          <label>
            Confirmar nova senha
          </label>

          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) =>
              setConfirmarSenha(e.target.value)
            }
          />

          <button onClick={alterarConta}>
            Salvar alterações
          </button>

        </section>

        {/* LOGOUT */}

        <section className="card">

          <h3>
            Sessão
          </h3>

          <button onClick={logout}>
            Sair da conta
          </button>

        </section>

      </main>

    </>

  )
}

export default AdminConfig