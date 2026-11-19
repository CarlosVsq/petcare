import { useState } from 'react'
import Modal from './Modal.jsx'

export default function Confirmacion({ titulo, mensaje, textoBoton = 'Confirmar', peligro = false, onConfirmar, onCerrar }) {
  const [procesando, setProcesando] = useState(false)

  const confirmar = async () => {
    setProcesando(true)
    try {
      await onConfirmar()
    } finally {
      setProcesando(false)
    }
  }

  return (
    <Modal titulo={titulo} onCerrar={onCerrar} ancho={440}>
      <p className="modal-texto">{mensaje}</p>
      <div className="acciones-formulario">
        <button type="button" className="boton" onClick={onCerrar}>Volver</button>
        <button type="button" className={`boton ${peligro ? 'boton-peligro' : 'boton-primario'}`} onClick={confirmar} disabled={procesando}>
          {procesando ? 'Procesando…' : textoBoton}
        </button>
      </div>
    </Modal>
  )
}
