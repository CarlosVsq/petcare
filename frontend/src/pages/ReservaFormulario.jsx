import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { clientesApi, reservasApi, veterinariosApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import Cargando from '../components/Cargando.jsx'
import { NOMBRES_DIAS, diaSemana, fechaLarga, hoyIso } from '../utils/formato.js'

export default function ReservaFormulario() {
  const { id } = useParams()
  const reservaOriginal = useLocation().state?.reserva
  const clienteInicial = useSearchParams()[0].get('clienteId') || ''
  const navegar = useNavigate()
  const { notificar, notificarError } = useNotificaciones()

  const [clientes, setClientes] = useState([])
  const [mascotas, setMascotas] = useState([])
  const [veterinarios, setVeterinarios] = useState([])
  const [clienteId, setClienteId] = useState(clienteInicial)
  const [mascotaId, setMascotaId] = useState('')
  const [veterinarioId, setVeterinarioId] = useState(reservaOriginal ? String(reservaOriginal.veterinarioId) : '')
  const [fecha, setFecha] = useState(reservaOriginal?.fecha || '')
  const [hora, setHora] = useState(reservaOriginal?.hora || '')
  const [motivo, setMotivo] = useState(reservaOriginal?.motivo || '')
  const [disponibles, setDisponibles] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    veterinariosApi.listar().then(setVeterinarios).catch(notificarError)
    clientesApi.listar().then(setClientes).catch(notificarError)
    if (clienteInicial) {
      clientesApi.mascotas(clienteInicial).then(setMascotas).catch(notificarError)
    }
  }, [clienteInicial, notificarError])

  useEffect(() => {
    if (veterinarioId && fecha) {
      veterinariosApi.disponibilidad(veterinarioId, fecha)
        .then((respuesta) => setDisponibles(respuesta.horariosDisponibles))
        .catch(notificarError)
    }
  }, [veterinarioId, fecha, notificarError])

  if (id && !reservaOriginal) {
    return <Navigate to="/reservas" replace />
  }

  const cambiarCliente = (valor) => {
    setClienteId(valor)
    setMascotaId('')
    setMascotas([])
    if (valor) {
      clientesApi.mascotas(valor).then(setMascotas).catch(notificarError)
    }
  }

  const cambiarVeterinario = (valor) => {
    setVeterinarioId(valor)
    setHora('')
    setDisponibles(null)
  }

  const cambiarFecha = (valor) => {
    setFecha(valor)
    setHora('')
    setDisponibles(null)
  }

  const veterinario = veterinarios.find((v) => String(v.id) === veterinarioId)
  const horarioDelDia = veterinario && fecha ? veterinario.horarios.filter((h) => h.diaSemana === diaSemana(fecha)) : []
  const esHorarioOriginal = reservaOriginal && String(reservaOriginal.veterinarioId) === veterinarioId
    && reservaOriginal.fecha === fecha
  const bloques = [...new Set([...(disponibles || []), ...(esHorarioOriginal ? [reservaOriginal.hora] : [])])].sort()

  const guardar = async (evento) => {
    evento.preventDefault()
    if (!hora) {
      notificar('advertencia', 'Seleccione un horario disponible')
      return
    }
    setGuardando(true)
    try {
      const datos = { veterinarioId: Number(veterinarioId), fecha, hora, motivo: motivo.trim() }
      const reserva = id
        ? await reservasApi.modificar(id, datos)
        : await reservasApi.crear({ ...datos, mascotaId: Number(mascotaId) })
      notificar('exito', id ? 'Reserva modificada' : 'Hora reservada',
        `${reserva.mascota} con ${reserva.veterinario}, ${fechaLarga(reserva.fecha)} a las ${reserva.hora}.`)
      navegar('/reservas')
    } catch (error) {
      notificarError(error, id ? 'No se pudo modificar la reserva' : 'No se pudo reservar la hora')
      setHora('')
      veterinariosApi.disponibilidad(veterinarioId, fecha).then((r) => setDisponibles(r.horariosDisponibles))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <div className="cabecera">
        <div>
          <Link to="/reservas" className="ayuda">← Reservas</Link>
          <h1>{id ? 'Modificar reserva' : 'Solicitar hora médica'}</h1>
          <p className="subtitulo">
            {id
              ? `${reservaOriginal.mascota} · ${reservaOriginal.cliente}`
              : 'Seleccione la mascota, el veterinario y un horario disponible'}
          </p>
        </div>
      </div>

      <form onSubmit={guardar}>
        <div className={`rejilla ${id ? 'rejilla-2' : 'rejilla-4'}`} style={{ marginBottom: 18 }}>
          {!id && (
            <>
              <div className="campo">
                <label>Cliente</label>
                <select className="entrada" value={clienteId} onChange={(e) => cambiarCliente(e.target.value)} required>
                  <option value="">Seleccione…</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.rut})</option>)}
                </select>
              </div>
              <div className="campo">
                <label>Mascota</label>
                <select className="entrada" value={mascotaId} onChange={(e) => setMascotaId(e.target.value)} required disabled={!clienteId}>
                  <option value="">{clienteId && mascotas.length === 0 ? 'Sin mascotas' : 'Seleccione…'}</option>
                  {mascotas.map((m) => <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>)}
                </select>
              </div>
            </>
          )}
          <div className="campo">
            <label>Veterinario</label>
            <select className="entrada" value={veterinarioId} onChange={(e) => cambiarVeterinario(e.target.value)} required>
              <option value="">Seleccione…</option>
              {veterinarios.map((v) => <option key={v.id} value={v.id}>{v.nombre} · {v.especialidad}</option>)}
            </select>
          </div>
          <div className="campo">
            <label>Fecha</label>
            <input className="entrada" type="date" min={hoyIso()} value={fecha} onChange={(e) => cambiarFecha(e.target.value)} required />
          </div>
        </div>

        <div className="tarjeta tarjeta-relleno" style={{ marginBottom: 16 }}>
          {!veterinarioId || !fecha ? (
            <p className="ayuda">Seleccione un veterinario y una fecha para ver los horarios disponibles.</p>
          ) : disponibles === null ? <Cargando texto="Consultando disponibilidad…" /> : (
            <>
              <strong>Horarios de {veterinario?.nombre} · {fechaLarga(fecha)}</strong>
              <p className="ayuda">
                {horarioDelDia.length > 0
                  ? `Atiende ${horarioDelDia.map((h) => `${h.horaInicio} – ${h.horaFin}`).join(' y ')}`
                  : `No atiende los días ${NOMBRES_DIAS[diaSemana(fecha)].toLowerCase()}`}
              </p>
              {bloques.length === 0 ? (
                <p className="ayuda" style={{ marginTop: 10 }}>No hay horarios disponibles para esta fecha.</p>
              ) : (
                <div className="bloques">
                  {bloques.map((bloque) => (
                    <button type="button" key={bloque} onClick={() => setHora(bloque)}
                      className={`bloque ${hora === bloque ? 'bloque-seleccionado' : ''}`}>
                      {bloque}
                      <small>{hora === bloque ? 'Seleccionado' : 'Disponible'}</small>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="campo">
          <label>Motivo de la consulta</label>
          <textarea className="entrada" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={255} required />
        </div>

        <div className="acciones-formulario">
          <Link className="boton" to="/reservas">Cancelar</Link>
          <button type="submit" className="boton boton-primario" disabled={guardando}>
            {guardando ? 'Guardando…' : id ? 'Guardar cambios' : 'Solicitar hora'}
          </button>
        </div>
      </form>
    </>
  )
}
