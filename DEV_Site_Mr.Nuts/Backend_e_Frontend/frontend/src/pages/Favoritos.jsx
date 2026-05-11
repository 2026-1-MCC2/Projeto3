import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import '../styles/global.css'
import '../styles/marketplace.css'

function Favoritos() {

  const navigate = useNavigate()

  const [favoritos, setFavoritos] = useState([])

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )

  // PROTEÇÃO

  useEffect(() => {

    if (!usuario || usuario.role !== 'buyer') {

      navigate('/login')

      return

    }

    carregarFavoritos()

  }, [])

  // CARREGAR FAVORITOS

  function carregarFavoritos() {

    const favoritosSalvos =
      JSON.parse(
        localStorage.getItem('favoritos')
      ) || []

    setFavoritos(favoritosSalvos)

  }

  return (

    <>

      <Navbar />

      <main className="marketplace-container">

        <section className="marketplace-header">

          <h1>
            Meus Favoritos
          </h1>

          <p>
            Produtos que você salvou
          </p>

        </section>

        <section className="products-grid">

          {favoritos.length === 0 ? (

            <p>
              Nenhum produto nos favoritos.
            </p>

          ) : (

            favoritos.map((produto) => (

              <article
                key={produto.id}
                className="product-card"
              >

                <div className="product-image"></div>

                <h3>
                  {produto.nome}
                </h3>

                <p>
                  {produto.descricao}
                </p>

                <strong>

                  {produto.preco
                    ? `R$ ${produto.preco}`
                    : 'Preço sob consulta'}

                </strong>

              </article>

            ))

          )}

        </section>

      </main>

    </>

  )
}

export default Favoritos