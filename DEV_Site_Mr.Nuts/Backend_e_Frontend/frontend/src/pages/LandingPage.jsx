import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'

import '../styles/global.css'
import '../styles/home.css'

function LandingPage() {

  return (

    <>

      <Navbar />

      {/* HERO */}

      <section className="hero">

        <div className="hero-text">

          <h1>
            Conectando compradores e fornecedores
          </h1>

          <p>
            Negocie direto com quem produz.
            Rápido, seguro e profissional.
          </p>

          <div className="hero-actions">

            <Link
              to="/marketplace"
              className="btn-primary"
            >
              Explorar produtos
            </Link>

            <Link
              to="/fornecedor"
              className="btn-secondary"
            >
              Cadastrar fornecedor
            </Link>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="features">

        <div className="card">

          <h3>
            Fornecedores verificados
          </h3>

          <p>
            Parcerias confiáveis e avaliações reais.
          </p>

        </div>

        <div className="card">

          <h3>
            Orçamento rápido
          </h3>

          <p>
            Solicite preços em poucos cliques.
          </p>

        </div>

        <div className="card">

          <h3>
            Entrega rastreável
          </h3>

          <p>
            Acompanhe seus pedidos com segurança.
          </p>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-content">

          <h2>
            Restocka
          </h2>

          <p>
            Marketplace inteligente para conectar compradores
            e fornecedores com rapidez e segurança.
          </p>

        </div>

        <div className="footer-bottom">

          <p>
            © 2026 Restocka • Todos os direitos reservados
          </p>

        </div>

      </footer>

    </>

  )
}

export default LandingPage