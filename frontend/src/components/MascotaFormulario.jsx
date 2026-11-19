import { useState } from 'react'
import Modal from './Modal.jsx'
import { clientesApi, mascotasApi } from '../services/api.js'
import { useNotificaciones } from './Notificaciones.jsx'
import { hoyIso } from '../utils/formato.js'

const ESPECIES = ['Perro', 'Gato', 'Ave', 'Conejo', 'Hámster', 'Reptil', 'Otra']

export default function MascotaFormulario({ clienteId, mascota, onGuardado, onCerrar }) {
  const [datos, setDatos] = useState(
    mascota
      ? { ...mascota, raza: mascota.raza || '', peso: String(mascota.peso) }
      : { nombre: '', especie: 'Perro', raza: '', fechaNacimiento: '', peso: '' },
  )
  const [guardando, setGuardando] = useState(false)
  const { notificar, notificarError } = useNotificaciones()

  const cambiar = (campo) => (evento) => setDatos({ ...datos, [campo]: evento.target.value })

  const guardar = async (evento) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      const cuerpo = {
        nombre: datos.nombre.trim(),
        especie: datos.especie,
        raza: datos.raza.trim() || null,
        fechaNacimiento: datos.fechaNacimiento,
        peso: Number(datos.peso),
      }
      const guardada = mascota
        ? await mascotasApi.actualizar(mascota.id, cuerpo)
        : await clientesApi.registrarMascota(clienteId, cuerpo)
      notificar('exito', mascota ? 'Mascota actualizada' : 'Mascota registrada', guardada.nombre)
      onGuardado(guardada)
    } catch (error) {
      notificarError(error, 'No se pudo guardar la mascota')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal titulo={mascota ? 'Editar mascota' : 'Registrar mascota'} onCerrar={onCerrar}>
      <form onSubmit={guardar} className="rejilla">
        <div className="rejilla rejilla-2">
          <div className="campo">
            <label>Nombre</label>
            <input className="entrada" value={datos.nombre} onChange={cambiar('nombre')} required />
          </div>
          <div className="campo">
            <label>Especie</label>
            <select className="entrada" value={datos.especie} onChange={cambiar('especie')}>
              {[...new Set([...ESPECIES, datos.especie])].map((especie) => <option key={especie}>{especie}</option>)}
            </select>
          </div>
        </div>
        <div className="campo">
          <label>Raza <span className="opcional">(opcional)</span></label>
          <input className="entrada" value={datos.raza} onChange={cambiar('raza')} />
        </div>
        <div className="rejilla rejilla-2">
          <div className="campo">
            <label>Fecha de nacimiento</label>
            <input className="entrada" type="date" max={hoyIso()} value={datos.fechaNacimiento} onChange={cambiar('fechaNacimiento')} required />
          </div>
          <div className="campo">
            <label>Peso (kg)</label>
            <input className="entrada" type="number" step="0.01" min="0.01" value={datos.peso} onChange={cambiar('peso')} required />
          </div>
        </div>
        <div className="acciones-formulario">
          <button type="button" className="boton" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="boton boton-primario" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
