import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import NovoProduto from './pages/NovoProduto'
import EditarProduto from './pages/EditarProduto'
import Login from './pages/Login'
import Fornecedor from './pages/Fornecedor'
import Favoritos from './pages/Favoritos'
import Admin from './pages/Admin'
import AdminConfig from './pages/AdminConfig'
import Cliente from './pages/Cliente'
import ClienteConfig from './pages/ClienteConfig'
import FornecedorConfig from './pages/FornecedorConfig'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/marketplace"
          element={<Home />}
        />

        <Route
          path="/novo"
          element={<NovoProduto />}
        />

        <Route
          path="/editar/:id"
          element={<EditarProduto />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* FORNECEDOR */}

        <Route
          path="/fornecedor"
          element={
            <ProtectedRoute
              allowedRoles={['supplier']}
            >
              <Fornecedor />
            </ProtectedRoute>
          }
        />

        {/* FAVORITOS */}

        <Route
          path="/favoritos"
          element={
            <ProtectedRoute
              allowedRoles={['buyer']}
            >
              <Favoritos />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            >
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ADMIN CONFIG */}

        <Route
          path="/admin-config"
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            >
              <AdminConfig />
            </ProtectedRoute>
          }
        />
<Route
  path="/cliente"
  element={
    <ProtectedRoute
      allowedRoles={['buyer']}
    >
      <Cliente />
    </ProtectedRoute>
  }
/>
<Route
  path="/cliente-config"
  element={
    <ProtectedRoute
      allowedRoles={['buyer']}
    >
      <ClienteConfig />
    </ProtectedRoute>
  }
/>
<Route
  path="/fornecedor-config"
  element={
    <ProtectedRoute
      allowedRoles={['supplier']}
    >
      <FornecedorConfig />
    </ProtectedRoute>
  }
/>
      </Routes>

    </BrowserRouter>

  )
}

export default App