import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import api from '../services/api'

import '../styles/global.css'
import '../styles/login.css'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const [senha, setSenha] = useState('')

  // ============================================================
  // LOGIN
  // ============================================================

  async function handleLogin(e) {

    e.preventDefault()

    try {

      const response =
        await api.post(
          '/auth/login',
          {
            email,
            senha
          }
        )

      const data = response.data

      // LOGIN OK

      alert(
        'Login realizado com sucesso!'
      )

      // SALVAR USUÁRIO

      localStorage.setItem(
        'usuario',
        JSON.stringify(data.usuario)
      )

      // REDIRECIONAR

      if (
        data.usuario.role === 'admin'
      ) {

        navigate('/admin')

      }

      else if (
        data.usuario.role === 'supplier'
      ) {

        navigate('/fornecedor')

      }

      else {

        navigate('/marketplace')

      }

    } catch (error) {

      console.error(error)

      alert(

        error.response?.data?.erro ||

        'Falha ao conectar com o servidor'

      )

    }

  }

  return (

    <>

      {/* TOPO */}

      <header className="topbar">

        <div className="logo">

          <Link to="/">
            Restocka
          </Link>

        </div>

        <nav>

          <Link
            to="/"
            className="nav-btn"
          >

            Início

          </Link>

          <Link
            to="/marketplace"
            className="nav-btn"
          >

            Marketplace

          </Link>

          <Link
            to="/login"
            className="btn-outline"
          >

            Entrar

          </Link>

        </nav>

      </header>

      {/* LOGIN */}

      <main className="login-container">

        <section className="login-box">

          <h1>
            Entrar
          </h1>

          <p>
            Acesse sua conta para continuar.
          </p>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                E-mail
              </label>

              <input
                type="email"
                placeholder="Digite seu e-mail"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            {/* SENHA */}

            <div className="form-group">

              <label>
                Senha
              </label>

              <input
                type="password"
                placeholder="Digite sua senha"
                required
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
              />

            </div>

            {/* BOTÃO */}

            <button
              type="submit"
              className="btn-primary"
            >

              Entrar

            </button>

          </form>

          {/* CADASTRO */}

          <p className="login-footer">

            Ainda não tem conta?

            <Link to="/register">

              Cadastre-se

            </Link>

          </p>

          {/* LOGINS DEMO */}

          <p className="login-footer">

            admin@demo.com - 123456

            <br />

            cliente@demo.com - 123456

            <br />

            fornecedor@demo.com - 123456

          </p>

          <p className="login-footer">

          <Link to="/forgot-password">
            Esqueci minha senha
            </Link>

          </p>

        </section>

      </main>

    </>

  )

}

export default Login