const ETIQUETAS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  ATENDIDA: 'Atendida',
}

export default function EstadoReserva({ estado }) {
  return <span className={`estado estado-${estado.toLowerCase()}`}>{ETIQUETAS[estado]}</span>
}
