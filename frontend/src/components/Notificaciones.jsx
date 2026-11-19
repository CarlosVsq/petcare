import { createContext, useCallback, useContext, useState } from 'react'

const NotificacionesContext = createContext(null)

export function NotificacionesProvider({ children }) {
  const [avisos, setAvisos] = useState([])

  const cerrar = useCallback((id) => {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id))
  }, [])

  const notificar = useCallback((tipo, titulo, texto, detalles = []) => {
    const id = crypto.randomUUID()
    setAvisos((actuales) => [...actuales, { id, tipo, titulo, texto, detalles }])
    setTimeout(() => cerrar(id), tipo === 'error' ? 8000 : 5000)
  }, [cerrar])

  const notificarError = useCallback((error, titulo = 'No se pudo completar la operación') => {
    notificar('error', titulo, error.message, error.detalles || [])
  }, [notificar])

  return (
    <NotificacionesContext.Provider value={{ notificar, notificarError }}>
      {children}
      <div className="avisos">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={`aviso aviso-${aviso.tipo}`} onClick={() => cerrar(aviso.id)}>
            <strong>{aviso.titulo}</strong>
            {aviso.texto && <span>{aviso.texto}</span>}
            {aviso.detalles.length > 0 && (
              <ul>
                {aviso.detalles.map((detalle) => <li key={detalle}>{detalle}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </NotificacionesContext.Provider>
  )
}

export function useNotificaciones() {
  return useContext(NotificacionesContext)
}
