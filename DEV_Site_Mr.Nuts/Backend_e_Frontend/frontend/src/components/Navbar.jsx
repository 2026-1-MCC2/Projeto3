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

        {/* BUYER */}

        {usuario?.role === 'buyer' && (

          <Link
            to="/favoritos"
            className="nav-btn"
          >
            Favoritos
          </Link>

        )}

        {/* SUPPLIER */}

        {usuario?.role === 'supplier' && (

          <Link
            to="/fornecedor"
            className="nav-btn"
          >
            Área fornecedor
          </Link>

        )}

        {/* ADMIN */}

        {usuario?.role === 'admin' && (

          <Link
            to="/admin"
            className="nav-btn"
          >
            Admin
          </Link>

        )}

        {/* LOGIN / LOGOUT */}

        {!usuario ? (

          <Link
            to="/login"
            className="btn-outline"
          >
            Entrar
          </Link>

        ) : (

          <button
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
