import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { medicamentosApi, reservasApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import { formatearFecha } from '../utils/formato.js'

const TRATAMIENTO_VACIO = { medicamento: '', dosis: '', frecuencia: '', duracion: '' }

export default function Atencion() {
  const { id } = useParams()
  const { state } = useLocation()
  const navegar = useNavigate()
  const { notificar, notificarError } = useNotificaciones()
  const reserva = state?.reserva
  const [diagnostico, setDiagnostico] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [tratamientos, setTratamientos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const buscar = async (evento) => {
    evento.preventDefault()
    if (!busqueda.trim()) {
      return
    }
    setBuscando(true)
    try {
      setResultados(await medicamentosApi.buscar(busqueda.trim()))
    } catch (error) {
      notificarError(error, 'No se pudo consultar la API de medicamentos')
      setResultados(null)
    } finally {
      setBuscando(false)
    }
  }

  const agregar = (medicamento = '') => setTratamientos([...tratamientos, { ...TRATAMIENTO_VACIO, medicamento }])

  const cambiarTratamiento = (indice, campo, valor) => {
    setTratamientos(tratamientos.map((t, i) => (i === indice ? { ...t, [campo]: valor } : t)))
  }

  const quitar = (indice) => setTratamientos(tratamientos.filter((_, i) => i !== indice))

  const guardar = async (evento) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      await reservasApi.registrarAtencion(id, {
        diagnostico: diagnostico.trim(),
        observaciones: observaciones.trim() || null,
        tratamientos: tratamientos.map((t) => ({
          medicamento: t.medicamento.trim(),
          dosis: t.dosis.trim(),
          frecuencia: t.frecuencia.trim(),
          duracion: t.duracion.trim(),
        })),
      })
      notificar('exito', 'Atención registrada', `La reserva de ${reserva.mascota} quedó ATENDIDA.`)
      navegar(`/clientes/${reserva.clienteId}/mascotas/${reserva.mascotaId}/historial`)
    } catch (error) {
      notificarError(error, 'No se pudo registrar la atención')
    } finally {
      setGuardando(false)
    }
  }

  if (!reserva) {
    return <Navigate to="/reservas" replace />
  }

  return (
    <>
      <div className="cabecera">
        <div>
          <Link to="/reservas" className="ayuda">← Reservas</Link>
          <h1>Registrar atención</h1>
          <p className="subtitulo">
            {reserva.mascota} · {reserva.cliente} · {reserva.veterinario} · {formatearFecha(reserva.fecha)} {reserva.hora} · {reserva.motivo}
          </p>
        </div>
      </div>

      <div className="rejilla rejilla-2" style={{ alignItems: 'start' }}>
        <form onSubmit={guardar} className="rejilla">
          <div className="campo">
            <label>Diagnóstico</label>
            <textarea className="entrada" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} maxLength={500} required />
          </div>
          <div className="campo">
            <label>Observaciones <span className="opcional">(opcional)</span></label>
            <textarea className="entrada" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} maxLength={500} />
          </div>

          <div className="seccion" style={{ margin: '6px 0 0' }}>
            <label style={{ fontWeight: 600 }}>Tratamientos</label>
            <button type="button" className="boton boton-chico" onClick={() => agregar()}>+ Agregar manualmente</button>
          </div>
          {tratamientos.length === 0 ? (
            <p className="ayuda">Sin tratamientos. Busque un medicamento en el panel derecho para agregarlo.</p>
          ) : tratamientos.map((tratamiento, indice) => (
            <div key={indice} className="tarjeta tarjeta-relleno rejilla" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="entrada" style={{ flex: 1 }} placeholder="Medicamento" value={tratamiento.medicamento}
                  onChange={(e) => cambiarTratamiento(indice, 'medicamento', e.target.value)} required />
                <button type="button" className="enlace enlace-peligro" onClick={() => quitar(indice)}>Quitar</button>
              </div>
              <div className="rejilla rejilla-3">
                <input className="entrada" placeholder="Dosis" value={tratamiento.dosis}
                  onChange={(e) => cambiarTratamiento(indice, 'dosis', e.target.value)} required />
                <input className="entrada" placeholder="Frecuencia" value={tratamiento.frecuencia}
                  onChange={(e) => cambiarTratamiento(indice, 'frecuencia', e.target.value)} required />
                <input className="entrada" placeholder="Duración" value={tratamiento.duracion}
                  onChange={(e) => cambiarTratamiento(indice, 'duracion', e.target.value)} required />
              </div>
            </div>
          ))}

          <div className="acciones-formulario">
            <Link className="boton" to="/reservas">Cancelar</Link>
            <button type="submit" className="boton boton-primario" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar atención'}
            </button>
          </div>
        </form>

        <div className="tarjeta tarjeta-relleno">
          <label style={{ fontWeight: 600 }}>Buscar medicamento <span className="etiqueta-api">API externa</span></label>
          <form onSubmit={buscar} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input className="entrada" style={{ flex: 1 }} placeholder="Ej.: amoxicilina" value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)} />
            <button className="boton" type="submit" disabled={buscando}>{buscando ? 'Buscando…' : 'Buscar'}</button>
          </form>
          {resultados !== null && resultados.length === 0 && (
            <p className="ayuda" style={{ marginTop: 12 }}>No se encontraron medicamentos con ese nombre.</p>
          )}
          {resultados?.map((medicamento) => (
            <div className="medicamento" key={medicamento.nombre}>
              <div className="medicamento-cabecera">
                <strong>{medicamento.nombre}</strong>
                <button type="button" className="boton boton-primario boton-chico" onClick={() => agregar(medicamento.nombre)}>Agregar</button>
              </div>
              <div className="ayuda">{medicamento.principioActivo} · {medicamento.presentacion} · {medicamento.especies.join(', ')}</div>
              <div>{medicamento.indicaciones}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
