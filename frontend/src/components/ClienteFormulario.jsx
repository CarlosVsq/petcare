import { useState } from 'react'
import Modal from './Modal.jsx'
import { clientesApi } from '../services/api.js'
import { useNotificaciones } from './Notificaciones.jsx'

const VACIO = { rut: '', nombre: '', correo: '', telefono: '', direccion: '' }

export default function ClienteFormulario({ cliente, onGuardado, onCerrar }) {
  const [datos, setDatos] = useState(cliente ? { ...VACIO, ...cliente } : VACIO)
  const [guardando, setGuardando] = useState(false)
  const { notificar, notificarError } = useNotificaciones()

  const cambiar = (campo) => (evento) => setDatos({ ...datos, [campo]: evento.target.value })

  const guardar = async (evento) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      const cuerpo = {
        rut: datos.rut.trim(),
        nombre: datos.nombre.trim(),
        correo: datos.correo.trim(),
        telefono: datos.telefono?.trim() || null,
        direccion: datos.direccion?.trim() || null,
      }
      const guardado = cliente ? await clientesApi.actualizar(cliente.id, cuerpo) : await clientesApi.crear(cuerpo)
      notificar('exito', cliente ? 'Cliente actualizado' : 'Cliente registrado', guardado.nombre)
      onGuardado(guardado)
    } catch (error) {
      notificarError(error, 'No se pudo guardar el cliente')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal titulo={cliente ? 'Editar cliente' : 'Nuevo cliente'} onCerrar={onCerrar}>
      <form onSubmit={guardar} className="rejilla">
        <div className="rejilla rejilla-2">
          <div className="campo">
            <label>RUT</label>
            <input className="entrada" value={datos.rut} onChange={cambiar('rut')} placeholder="12.345.678-9" required />
          </div>
          <div className="campo">
            <label>Teléfono <span className="opcional">(opcional)</span></label>
            <input className="entrada" value={datos.telefono || ''} onChange={cambiar('telefono')} placeholder="+56 9 1234 5678" />
          </div>
        </div>
        <div className="campo">
          <label>Nombre completo</label>
          <input className="entrada" value={datos.nombre} onChange={cambiar('nombre')} required />
        </div>
        <div className="campo">
          <label>Correo electrónico</label>
          <input className="entrada" type="email" value={datos.correo} onChange={cambiar('correo')} required />
        </div>
        <div className="campo">
          <label>Dirección <span className="opcional">(opcional)</span></label>
          <input className="entrada" value={datos.direccion || ''} onChange={cambiar('direccion')} />
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
