import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clientesApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import ClienteFormulario from '../components/ClienteFormulario.jsx'
import Confirmacion from '../components/Confirmacion.jsx'
import Cargando from '../components/Cargando.jsx'

export default function Clientes() {
  const [clientes, setClientes] = useState(null)
  const [filtros, setFiltros] = useState({ nombre: '', rut: '' })
  const [editando, setEditando] = useState(null)
  const [eliminando, setEliminando] = useState(null)
  const { notificar, notificarError } = useNotificaciones()

  const cargar = useCallback(async (criterios = {}) => {
    try {
      setClientes(await clientesApi.listar(criterios))
    } catch (error) {
      notificarError(error, 'No se pudieron cargar los clientes')
      setClientes([])
    }
  }, [notificarError])

  useEffect(() => {
    cargar()
  }, [cargar])

  const buscar = (evento) => {
    evento.preventDefault()
    cargar(filtros)
  }

  const limpiar = () => {
    setFiltros({ nombre: '', rut: '' })
    cargar()
  }

  const eliminar = async () => {
    try {
      await clientesApi.eliminar(eliminando.id)
      notificar('exito', 'Cliente eliminado', eliminando.nombre)
      setEliminando(null)
      cargar(filtros)
    } catch (error) {
      notificarError(error, 'No se pudo eliminar el cliente')
      setEliminando(null)
    }
  }

  return (
    <>
      <div className="cabecera">
        <div>
          <h1>Clientes</h1>
          <p className="subtitulo">Clientes registrados en la clínica</p>
        </div>
        <button className="boton boton-primario" onClick={() => setEditando({})}>+ Nuevo cliente</button>
      </div>

      <form className="filtros" onSubmit={buscar}>
        <input className="entrada" style={{ width: 280 }} placeholder="Buscar por nombre…" value={filtros.nombre}
          onChange={(evento) => setFiltros({ ...filtros, nombre: evento.target.value })} />
        <input className="entrada" style={{ width: 190 }} placeholder="RUT" value={filtros.rut}
          onChange={(evento) => setFiltros({ ...filtros, rut: evento.target.value })} />
        <button className="boton" type="submit">Buscar</button>
        {(filtros.nombre || filtros.rut) && <button className="boton" type="button" onClick={limpiar}>Limpiar</button>}
      </form>

      <div className="tarjeta tabla-contenedor">
        {clientes === null ? <Cargando /> : clientes.length === 0 ? (
          <div className="vacio">No se encontraron clientes</div>
        ) : (
          <table>
            <thead>
              <tr><th>RUT</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Dirección</th><th></th></tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.rut}</td>
                  <td><Link to={`/clientes/${cliente.id}`}><strong>{cliente.nombre}</strong></Link></td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono || '—'}</td>
                  <td>{cliente.direccion || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link className="enlace" to={`/clientes/${cliente.id}`}>Ver</Link>
                    <button className="enlace" onClick={() => setEditando(cliente)}>Editar</button>
                    <button className="enlace enlace-peligro" onClick={() => setEliminando(cliente)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editando && (
        <ClienteFormulario
          cliente={editando.id ? editando : null}
          onCerrar={() => setEditando(null)}
          onGuardado={() => {
            setEditando(null)
            cargar(filtros)
          }}
        />
      )}
      {eliminando && (
        <Confirmacion
          titulo="Eliminar cliente"
          mensaje={`¿Eliminar a ${eliminando.nombre}? También se eliminarán sus mascotas. No se puede eliminar si sus mascotas tienen reservas registradas.`}
          textoBoton="Eliminar"
          peligro
          onConfirmar={eliminar}
          onCerrar={() => setEliminando(null)}
        />
      )}
    </>
  )
}
