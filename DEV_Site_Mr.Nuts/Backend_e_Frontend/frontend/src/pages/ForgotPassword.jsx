import { useState } from 'react'

import { Link } from 'react-router-dom'

import api from '../services/api'

import '../styles/global.css'
import '../styles/login.css'

function ForgotPassword() {

  const [email, setEmail] = useState('')

  const [link, setLink] = useState('')

  async function solicitarRecuperacao(e) {

    e.preventDefault()

    try {

      const response =
        await api.post(
          '/auth/forgot-password',
          {
            email
          }
        )

      alert(response.data.mensagem)

      setLink(response.data.link)

    } catch (error) {

      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao solicitar recuperação'
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

        <nav>

          <Link
            to="/login"
            className="btn-outline"
          >
            Voltar ao login
          </Link>

        </nav>

      </header>

      <main className="login-container">

        <section className="login-box">

          <h1>
            Recuperar senha
          </h1>

          <p>
            Informe seu e-mail para gerar um link de redefinição.
          </p>

          <form onSubmit={solicitarRecuperacao}>

            <div className="form-group">

              <label>
                E-mail
              </label>

              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="btn-primary"
            >
              Gerar link
            </button>

          </form>

          {link && (

            <p className="login-footer">

              Link gerado:
              <br />

              <Link to={link.replace(
                'http://localhost:5173',
                ''
              )}>
                Redefinir senha
              </Link>

            </p>

          )}

        </section>

      </main>

    </>

  )

}

export default ForgotPassword