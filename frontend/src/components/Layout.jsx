import { NavLink, Outlet } from 'react-router-dom'

const ENLACES = [
  { ruta: '/reservas', texto: 'Reservas', icono: '📅' },
  { ruta: '/reservas/nueva', texto: 'Nueva reserva', icono: '➕' },
  { ruta: '/clientes', texto: 'Clientes', icono: '👥' },
  { ruta: '/veterinarios', texto: 'Veterinarios', icono: '🩺' },
  { ruta: '/ubicacion', texto: 'Ubicación', icono: '📍' },
]

export default function Layout() {
  return (
    <div className="aplicacion">
      <nav className="barra-lateral">
        <div className="marca">Pet<span>Care</span></div>
        {ENLACES.map((enlace) => (
          <NavLink key={enlace.ruta} to={enlace.ruta} end className={({ isActive }) => (isActive ? 'activo' : '')}>
            <span className="icono">{enlace.icono}</span>
            {enlace.texto}
          </NavLink>
        ))}
        <div className="pie-barra">Clínica Veterinaria PetCare</div>
      </nav>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}
