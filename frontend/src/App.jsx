import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Reservas from './pages/Reservas.jsx'
import ReservaFormulario from './pages/ReservaFormulario.jsx'
import Atencion from './pages/Atencion.jsx'
import Clientes from './pages/Clientes.jsx'
import ClienteDetalle from './pages/ClienteDetalle.jsx'
import Historial from './pages/Historial.jsx'
import Veterinarios from './pages/Veterinarios.jsx'
import Ubicacion from './pages/Ubicacion.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/reservas" replace />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="reservas/nueva" element={<ReservaFormulario key="nueva" />} />
        <Route path="reservas/:id/modificar" element={<ReservaFormulario key="modificar" />} />
        <Route path="reservas/:id/atencion" element={<Atencion />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id" element={<ClienteDetalle />} />
        <Route path="clientes/:clienteId/mascotas/:mascotaId/historial" element={<Historial />} />
        <Route path="veterinarios" element={<Veterinarios />} />
        <Route path="ubicacion" element={<Ubicacion />} />
        <Route path="*" element={<Navigate to="/reservas" replace />} />
      </Route>
    </Routes>
  )
}
