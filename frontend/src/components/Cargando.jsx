export default function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className="cargando">
      <span className="spinner" />
      {texto}
    </div>
  )
}
