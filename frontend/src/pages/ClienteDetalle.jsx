import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clientesApi, mascotasApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import ClienteFormulario from '../components/ClienteFormulario.jsx'
import MascotaFormulario from '../components/MascotaFormulario.jsx'
import Confirmacion from '../components/Confirmacion.jsx'
import Cargando from '../components/Cargando.jsx'
import { edad, formatearFecha, formatearPeso } from '../utils/formato.js'

export default function ClienteDetalle() {
  const { id } = useParams()
  const navegar = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [mascotas, setMascotas] = useState(null)
  const [editandoCliente, setEditandoCliente] = useState(false)
  const [editandoMascota, setEditandoMascota] = useState(null)
  const [eliminandoMascota, setEliminandoMascota] = useState(null)
  const { notificar, notificarError } = useNotificaciones()

  const cargar = useCallback(async () => {
    try {
      const [datosCliente, datosMascotas] = await Promise.all([clientesApi.obtener(id), clientesApi.mascotas(id)])
      setCliente(datosCliente)
      setMascotas(datosMascotas)
    } catch (error) {
      notificarError(error, 'No se pudo cargar el cliente')
      navegar('/clientes')
    }
  }, [id, navegar, notificarError])

  useEffect(() => {
    cargar()
  }, [cargar])

  const eliminarMascota = async () => {
    try {
      await mascotasApi.eliminar(eliminandoMascota.id)
      notificar('exito', 'Mascota eliminada', eliminandoMascota.nombre)
      setEliminandoMascota(null)
      cargar()
    } catch (error) {
      notificarError(error, 'No se pudo eliminar la mascota')
      setEliminandoMascota(null)
    }
  }

  if (!cliente) {
    return <Cargando />
  }

  return (
    <>
      <div className="cabecera">
        <div>
          <Link to="/clientes" className="ayuda">← Clientes</Link>
          <h1>{cliente.nombre}</h1>
          <p className="subtitulo">RUT {cliente.rut}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="boton" onClick={() => setEditandoCliente(true)}>Editar cliente</button>
          <Link className="boton boton-primario" to={`/reservas/nueva?clienteId=${cliente.id}`}>Solicitar hora</Link>
        </div>
      </div>

      <div className="tarjeta tarjeta-relleno datos">
        <div className="dato"><span>Correo</span><strong>{cliente.correo}</strong></div>
        <div className="dato"><span>Teléfono</span><strong>{cliente.telefono || '—'}</strong></div>
        <div className="dato"><span>Dirección</span><strong>{cliente.direccion || '—'}</strong></div>
      </div>

      <div className="seccion">
        <h2>Mascotas</h2>
        <button className="boton boton-primario" onClick={() => setEditandoMascota({})}>+ Registrar mascota</button>
      </div>

      <div className="tarjeta tabla-contenedor">
        {mascotas.length === 0 ? (
          <div className="vacio">Este cliente aún no tiene mascotas registradas</div>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Especie</th><th>Raza</th><th>Nacimiento</th><th>Edad</th><th>Peso</th><th></th></tr>
            </thead>
            <tbody>
              {mascotas.map((mascota) => (
                <tr key={mascota.id}>
                  <td><strong>{mascota.nombre}</strong></td>
                  <td>{mascota.especie}</td>
                  <td>{mascota.raza || '—'}</td>
                  <td>{formatearFecha(mascota.fechaNacimiento)}</td>
                  <td>{edad(mascota.fechaNacimiento)}</td>
                  <td>{formatearPeso(mascota.peso)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link className="enlace" to={`/clientes/${cliente.id}/mascotas/${mascota.id}/historial`}>Historial</Link>
                    <button className="enlace" onClick={() => setEditandoMascota(mascota)}>Editar</button>
                    <button className="enlace enlace-peligro" onClick={() => setEliminandoMascota(mascota)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editandoCliente && (
        <ClienteFormulario
          cliente={cliente}
          onCerrar={() => setEditandoCliente(false)}
          onGuardado={(guardado) => {
            setCliente(guardado)
            setEditandoCliente(false)
          }}
        />
      )}
      {editandoMascota && (
        <MascotaFormulario
          clienteId={cliente.id}
          mascota={editandoMascota.id ? editandoMascota : null}
          onCerrar={() => setEditandoMascota(null)}
          onGuardado={() => {
            setEditandoMascota(null)
            cargar()
          }}
        />
      )}
      {eliminandoMascota && (
        <Confirmacion
          titulo="Eliminar mascota"
          mensaje={`¿Eliminar a ${eliminandoMascota.nombre}? No se puede eliminar si tiene reservas registradas.`}
          textoBoton="Eliminar"
          peligro
          onConfirmar={eliminarMascota}
          onCerrar={() => setEliminandoMascota(null)}
        />
      )}
    </>
  )
}
