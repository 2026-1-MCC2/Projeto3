import { Link, useNavigate } from 'react-router-dom'

import '../styles/global.css'

function Navbar() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  function logout() {

    localStorage.removeItem('usuario')

    navigate('/login')

  }

  function obterRotaConfiguracao() {

    if (usuario?.role === 'buyer') {
      return '/cliente-config'
    }

    if (usuario?.role === 'supplier') {
      return '/fornecedor-config'
    }

    if (usuario?.role === 'admin') {
      return '/admin-config'
    }

    return '/login'

  }

  return (

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

        {usuario?.role === 'buyer' && (

          <Link
            to="/favoritos"
            className="nav-btn"
          >
            Favoritos
          </Link>

        )}

        {usuario?.role === 'supplier' && (

          <Link
            to="/fornecedor"
            className="nav-btn"
          >
            Área fornecedor
          </Link>

        )}

        {usuario?.role === 'admin' && (

          <Link
            to="/admin"
            className="nav-btn"
          >
            Admin
          </Link>

        )}

        {usuario && (

          <Link
            to={obterRotaConfiguracao()}
            className="nav-btn"
          >
            Configurações
          </Link>

        )}

        {!usuario ? (

          <Link
            to="/login"
            className="btn-outline"
          >
            Entrar
          </Link>

        ) : (

          <button
            type="button"
            onClick={logout}
            className="btn-outline"
          >
            Sair
          </button>

        )}

      </nav>

    </header>

  )

}

export default Navbar