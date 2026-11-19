import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { clientesApi, mascotasApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import Cargando from '../components/Cargando.jsx'
import { edad, formatearFecha, formatearPeso } from '../utils/formato.js'

export default function Historial() {
  const { clienteId, mascotaId } = useParams()
  const [cliente, setCliente] = useState(null)
  const [mascota, setMascota] = useState(null)
  const [atenciones, setAtenciones] = useState(null)
  const { notificarError } = useNotificaciones()

  useEffect(() => {
    Promise.all([clientesApi.obtener(clienteId), clientesApi.mascotas(clienteId), mascotasApi.historial(mascotaId)])
      .then(([datosCliente, datosMascotas, historial]) => {
        setCliente(datosCliente)
        setMascota(datosMascotas.find((m) => String(m.id) === mascotaId))
        setAtenciones(historial)
      })
      .catch((error) => {
        notificarError(error, 'No se pudo cargar el historial')
        setAtenciones([])
      })
  }, [clienteId, mascotaId, notificarError])

  if (atenciones === null) {
    return <Cargando />
  }

  return (
    <>
      <div className="cabecera">
        <div>
          <Link to={`/clientes/${clienteId}`} className="ayuda">← {cliente?.nombre || 'Cliente'}</Link>
          <h1>Historial médico{mascota ? ` de ${mascota.nombre}` : ''}</h1>
          {mascota && (
            <p className="subtitulo">
              {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''} · {edad(mascota.fechaNacimiento)} · {formatearPeso(mascota.peso)}
              {cliente ? ` · Dueño(a): ${cliente.nombre}` : ''}
            </p>
          )}
        </div>
      </div>

      {atenciones.length === 0 ? (
        <div className="tarjeta vacio">La mascota aún no tiene atenciones registradas</div>
      ) : atenciones.map((atencion) => (
        <div className="atencion" key={atencion.atencionId}>
          <div className="atencion-fecha">
            <strong>{formatearFecha(atencion.fecha)}</strong>
            <div className="ayuda">{atencion.hora} hrs</div>
            <div className="ayuda">{atencion.veterinario}</div>
          </div>
          <div className="atencion-cuerpo">
            <div className="ayuda">Motivo: {atencion.motivo}</div>
            <h2 style={{ margin: '3px 0' }}>{atencion.diagnostico}</h2>
            {atencion.observaciones && <p className="ayuda" style={{ marginBottom: 8 }}>{atencion.observaciones}</p>}
            {atencion.tratamientos.length > 0 ? (
              <table>
                <thead><tr><th>Medicamento</th><th>Dosis</th><th>Frecuencia</th><th>Duración</th></tr></thead>
                <tbody>
                  {atencion.tratamientos.map((tratamiento, indice) => (
                    <tr key={indice}>
                      <td>{tratamiento.medicamento}</td>
                      <td>{tratamiento.dosis}</td>
                      <td>{tratamiento.frecuencia}</td>
                      <td>{tratamiento.duracion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="ayuda">Sin tratamientos prescritos</p>}
          </div>
        </div>
      ))}
    </>
  )
}
