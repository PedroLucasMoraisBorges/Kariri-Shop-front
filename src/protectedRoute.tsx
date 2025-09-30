import { Navigate, Outlet } from 'react-router-dom'

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('access_token') !== null
}

// Componente de proteção de rota
export function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/sign-in" replace />
}
