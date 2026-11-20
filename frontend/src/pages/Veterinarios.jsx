import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { veterinariosApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import Cargando from '../components/Cargando.jsx'
import { NOMBRES_DIAS } from '../utils/formato.js'

export default function Veterinarios() {
  const [veterinarios, setVeterinarios] = useState(null)
  const { notificarError } = useNotificaciones()

  useEffect(() => {
    veterinariosApi.listar().then(setVeterinarios).catch((error) => {
      notificarError(error, 'No se pudieron cargar los veterinarios')
      setVeterinarios([])
    })
  }, [notificarError])

  if (veterinarios === null) {
    return <Cargando />
  }

  return (
    <>
      <div className="cabecera">
        <div>
          <h1>Veterinarios</h1>
          <p className="subtitulo">Profesionales de la clínica y su horario semanal de atención</p>
        </div>
        <Link className="boton boton-primario" to="/reservas/nueva">Solicitar hora</Link>
      </div>
      <div className="veterinarios">
        {veterinarios.map((veterinario) => {
          const porDia = veterinario.horarios.reduce((dias, horario) => {
            dias[horario.diaSemana] = [...(dias[horario.diaSemana] || []), `${horario.horaInicio} – ${horario.horaFin}`]
            return dias
          }, {})
          return (
            <div className="tarjeta tarjeta-relleno" key={veterinario.id}>
              <h2>{veterinario.nombre}</h2>
              <p className="subtitulo">{veterinario.especialidad} · {veterinario.correo}</p>
              <div style={{ marginTop: 12 }}>
                {Object.keys(NOMBRES_DIAS).filter((dia) => porDia[dia]).map((dia) => (
                  <div className="horario-dia" key={dia}>
                    <span>{NOMBRES_DIAS[dia]}</span>
                    <strong>{porDia[dia].join(' y ')}</strong>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
