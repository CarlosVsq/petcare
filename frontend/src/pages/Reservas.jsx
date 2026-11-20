import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { reservasApi, veterinariosApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import Confirmacion from '../components/Confirmacion.jsx'
import Cargando from '../components/Cargando.jsx'
import EstadoReserva from '../components/EstadoReserva.jsx'
import { formatearFecha } from '../utils/formato.js'

const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ATENDIDA']

export default function Reservas() {
  const navegar = useNavigate()
  const [reservas, setReservas] = useState(null)
  const [veterinarios, setVeterinarios] = useState([])
  const [filtros, setFiltros] = useState({ fecha: '', veterinarioId: '', estado: '' })
  const [accion, setAccion] = useState(null)
  const { notificar, notificarError } = useNotificaciones()

  const cargar = useCallback(async (criterios) => {
    try {
      setReservas(await reservasApi.listar(criterios))
    } catch (error) {
      notificarError(error, 'No se pudieron cargar las reservas')
      setReservas([])
    }
  }, [notificarError])

  useEffect(() => {
    veterinariosApi.listar().then(setVeterinarios).catch(() => setVeterinarios([]))
  }, [])

  useEffect(() => {
    cargar(filtros)
  }, [cargar, filtros])

  const cambiar = (campo) => (evento) => setFiltros({ ...filtros, [campo]: evento.target.value })

  const cambiarEstado = async () => {
    const { reserva, estado } = accion
    try {
      const resultado = await reservasApi.cambiarEstado(reserva.id, estado)
      const titulo = estado === 'CONFIRMADA' ? 'Reserva confirmada' : 'Reserva cancelada'
      if (resultado.notificacionEnviada) {
        notificar('exito', titulo, `Se envió un correo de notificación a ${reserva.cliente}.`)
      } else {
        notificar('advertencia', titulo, 'El servicio de notificaciones no está disponible; no se pudo enviar el correo.')
      }
      setAccion(null)
      cargar(filtros)
    } catch (error) {
      notificarError(error, 'No se pudo cambiar el estado')
      setAccion(null)
    }
  }

  const acciones = (reserva) => {
    const confirmar = (
      <button className="enlace" onClick={() => setAccion({ reserva, estado: 'CONFIRMADA' })}>Confirmar</button>
    )
    const atender = (
      <button className="enlace" onClick={() => navegar(`/reservas/${reserva.id}/atencion`, { state: { reserva } })}>Atender</button>
    )
    const modificar = (
      <button className="enlace" onClick={() => navegar(`/reservas/${reserva.id}/modificar`, { state: { reserva } })}>Modificar</button>
    )
    const cancelar = (
      <button className="enlace enlace-peligro" onClick={() => setAccion({ reserva, estado: 'CANCELADA' })}>Cancelar</button>
    )
    if (reserva.estado === 'PENDIENTE') {
      return <>{confirmar}{modificar}{cancelar}</>
    }
    if (reserva.estado === 'CONFIRMADA') {
      return <>{atender}{modificar}{cancelar}</>
    }
    if (reserva.estado === 'ATENDIDA') {
      return <Link className="enlace" to={`/clientes/${reserva.clienteId}/mascotas/${reserva.mascotaId}/historial`}>Ver historial</Link>
    }
    return <span className="ayuda">—</span>
  }

  return (
    <>
      <div className="cabecera">
        <div>
          <h1>Reservas</h1>
          <p className="subtitulo">Horas médicas agendadas</p>
        </div>
        <Link className="boton boton-primario" to="/reservas/nueva">+ Nueva reserva</Link>
      </div>

      <div className="filtros">
        <div className="campo">
          <label>Fecha</label>
          <input className="entrada" type="date" value={filtros.fecha} onChange={cambiar('fecha')} />
        </div>
        <div className="campo">
          <label>Veterinario</label>
          <select className="entrada" value={filtros.veterinarioId} onChange={cambiar('veterinarioId')}>
            <option value="">Todos</option>
            {veterinarios.map((v) => <option key={v.id} value={v.id}>{v.nombre}</option>)}
          </select>
        </div>
        <div className="campo">
          <label>Estado</label>
          <select className="entrada" value={filtros.estado} onChange={cambiar('estado')}>
            <option value="">Todos</option>
            {ESTADOS.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
          </select>
        </div>
        {(filtros.fecha || filtros.veterinarioId || filtros.estado) && (
          <button className="boton" onClick={() => setFiltros({ fecha: '', veterinarioId: '', estado: '' })}>Limpiar</button>
        )}
      </div>

      <div className="tarjeta tabla-contenedor">
        {reservas === null ? <Cargando /> : reservas.length === 0 ? (
          <div className="vacio">No hay reservas con los filtros seleccionados</div>
        ) : (
          <table>
            <thead>
              <tr><th>Fecha</th><th>Hora</th><th>Mascota</th><th>Cliente</th><th>Veterinario</th><th>Motivo</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{formatearFecha(reserva.fecha)}</td>
                  <td><strong>{reserva.hora}</strong></td>
                  <td>{reserva.mascota}</td>
                  <td><Link to={`/clientes/${reserva.clienteId}`}>{reserva.cliente}</Link></td>
                  <td>{reserva.veterinario}</td>
                  <td>{reserva.motivo}</td>
                  <td><EstadoReserva estado={reserva.estado} /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{acciones(reserva)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {accion && (
        <Confirmacion
          titulo={accion.estado === 'CONFIRMADA' ? 'Confirmar reserva' : 'Cancelar reserva'}
          mensaje={`${accion.estado === 'CONFIRMADA' ? '¿Confirmar' : '¿Cancelar'} la reserva de ${accion.reserva.mascota} con ${accion.reserva.veterinario} el ${formatearFecha(accion.reserva.fecha)} a las ${accion.reserva.hora}? Se enviará un correo a ${accion.reserva.cliente}.`}
          textoBoton={accion.estado === 'CONFIRMADA' ? 'Confirmar' : 'Cancelar reserva'}
          peligro={accion.estado === 'CANCELADA'}
          onConfirmar={cambiarEstado}
          onCerrar={() => setAccion(null)}
        />
      )}
    </>
  )
}
