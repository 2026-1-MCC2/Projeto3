import { useState } from 'react'

import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'

import api from '../services/api'

import '../styles/global.css'
import '../styles/login.css'

function ResetPassword() {

  const { token } = useParams()

  const navigate = useNavigate()

  const [novaSenha, setNovaSenha] =
    useState('')

  const [confirmarSenha, setConfirmarSenha] =
    useState('')

  async function redefinirSenha(e) {

    e.preventDefault()

    if (novaSenha !== confirmarSenha) {

      alert('As senhas não coincidem')

      return

    }

    try {

      const response =
        await api.post(
          `/auth/reset-password/${token}`,
          {
            novaSenha
          }
        )

      alert(response.data.mensagem)

      navigate('/login')

    } catch (error) {

      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao redefinir senha'
      )

    }

  }

  return (

    <>

      <header className="topbar">

        <div className="logo">

          <Link to="/">
            Restocka
          </Link>

        </div>

      </header>

      <main className="login-container">

        <section className="login-box">

          <h1>
            Nova senha
          </h1>

          <p>
            Digite sua nova senha.
          </p>

          <form onSubmit={redefinirSenha}>

            <div className="form-group">

              <label>
                Nova senha
              </label>

              <input
                type="password"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) =>
                  setNovaSenha(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Confirmar senha
              </label>

              <input
                type="password"
                placeholder="Confirme a nova senha"
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="btn-primary"
            >
              Salvar nova senha
            </button>

          </form>

        </section>

      </main>

    </>

  )

}

export default ResetPassword