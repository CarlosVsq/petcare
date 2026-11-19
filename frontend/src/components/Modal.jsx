import { useEffect } from 'react'

export default function Modal({ titulo, onCerrar, children, ancho = 520 }) {
  useEffect(() => {
    const alPresionar = (evento) => {
      if (evento.key === 'Escape') {
        onCerrar()
      }
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [onCerrar])

  return (
    <div className="modal-fondo" onMouseDown={onCerrar}>
      <div className="modal" style={{ maxWidth: ancho }} onMouseDown={(evento) => evento.stopPropagation()}>
        <div className="modal-cabecera">
          <h2>{titulo}</h2>
          <button type="button" className="boton-icono" onClick={onCerrar} aria-label="Cerrar">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
