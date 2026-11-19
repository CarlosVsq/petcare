import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Clientes from './pages/Clientes.jsx'
import ClienteDetalle from './pages/ClienteDetalle.jsx'
import Historial from './pages/Historial.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/clientes" replace />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id" element={<ClienteDetalle />} />
        <Route path="clientes/:clienteId/mascotas/:mascotaId/historial" element={<Historial />} />
        <Route path="*" element={<Navigate to="/clientes" replace />} />
      </Route>
    </Routes>
  )
}
