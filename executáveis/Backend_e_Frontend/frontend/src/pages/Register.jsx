import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import api from '../services/api'

import '../styles/global.css'
import '../styles/login.css'

function Register() {

  const navigate = useNavigate()

  const [nome, setNome] = useState('')

  const [email, setEmail] = useState('')

  const [senha, setSenha] = useState('')

  const [role, setRole] =
    useState('buyer')

  // CADASTRO

  async function cadastrar(e) {

    e.preventDefault()

    try {

      const response =
        await api.post(
          '/auth/register',
          {
            nome,
            email,
            senha,
            role
          }
        )

      alert(response.data.mensagem)

      navigate('/login')

    } catch (error) {

      console.error(error)

      alert(
        error.response?.data?.erro ||
        'Erro ao cadastrar'
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

      <main className="login-container">

        <section className="login-box">

          <h1>
            Criar Conta
          </h1>

          <p>
            Cadastre-se no marketplace.
          </p>

          <form onSubmit={cadastrar}>

            {/* NOME */}

            <div className="form-group">

              <label>
                Nome
              </label>

              <input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                required
              />

            </div>

            {/* EMAIL */}

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

            {/* SENHA */}

            <div className="form-group">

              <label>
                Senha
              </label>

              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                required
              />

            </div>

            {/* TIPO */}

            <div className="form-group">

              <label>
                Tipo de conta
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >

                <option value="buyer">
                  Cliente
                </option>

                <option value="supplier">
                  Fornecedor
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="btn-primary"
            >

              Cadastrar

            </button>

          </form>

          <p className="login-footer">

            Já possui conta?

            <Link to="/login">

              Entrar

            </Link>

          </p>

        </section>

      </main>

    </>

  )

}

export default Register