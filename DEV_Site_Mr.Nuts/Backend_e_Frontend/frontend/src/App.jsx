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
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Produto from './pages/Produto'

import UsuariosAdmin from './pages/UsuariosAdmin'
import ProdutosAdmin from './pages/ProdutosAdmin'

import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<Home />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/novo" element={<NovoProduto />} />
        <Route path="/editar/:id" element={<EditarProduto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* FORNECEDOR */}
        <Route
          path="/fornecedor"
          element={
            <ProtectedRoute allowedRoles={['supplier']}>
              <Fornecedor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fornecedor-config"
          element={
            <ProtectedRoute allowedRoles={['supplier']}>
              <FornecedorConfig />
            </ProtectedRoute>
          }
        />

        {/* CLIENTE */}
        <Route
          path="/cliente"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Cliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente-config"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <ClienteConfig />
            </ProtectedRoute>
          }
        />

        {/* FAVORITOS */}
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Favoritos />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-config"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminConfig />
            </ProtectedRoute>
          }
        />

        {/* ✅ NOVAS ROTAS DO ADMIN */}
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsuariosAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/produtos"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProdutosAdmin />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App