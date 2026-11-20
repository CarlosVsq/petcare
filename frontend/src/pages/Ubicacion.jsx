import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconoMarcador from 'leaflet/dist/images/marker-icon.png'
import iconoMarcador2x from 'leaflet/dist/images/marker-icon-2x.png'
import sombraMarcador from 'leaflet/dist/images/marker-shadow.png'
import { clinicaApi } from '../services/api.js'
import { useNotificaciones } from '../components/Notificaciones.jsx'
import Cargando from '../components/Cargando.jsx'

const marcador = L.icon({
  iconUrl: iconoMarcador,
  iconRetinaUrl: iconoMarcador2x,
  shadowUrl: sombraMarcador,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function Ubicacion() {
  const [clinica, setClinica] = useState(null)
  const [error, setError] = useState(null)
  const { notificarError } = useNotificaciones()

  useEffect(() => {
    clinicaApi.ubicacion().then(setClinica).catch((e) => {
      setError(e.message)
      notificarError(e, 'No se pudo obtener la ubicación')
    })
  }, [notificarError])

  return (
    <>
      <div className="cabecera">
        <div>
          <h1>Ubicación de la clínica</h1>
          <p className="subtitulo">Información obtenida desde la API externa de geolocalización</p>
        </div>
      </div>
      {error ? <div className="tarjeta vacio">{error}</div> : !clinica ? <Cargando /> : (
        <div className="mapa-pagina">
          <div className="tarjeta tarjeta-relleno lista-datos">
            <h2>{clinica.nombre}</h2>
            <div className="dato"><span>Dirección</span><strong>{clinica.direccion}</strong></div>
            <div className="dato"><span>Coordenadas</span><strong>{clinica.latitud}, {clinica.longitud}</strong></div>
            <a className="boton boton-primario" style={{ alignSelf: 'flex-start' }} target="_blank" rel="noreferrer"
              href={`https://www.openstreetmap.org/directions?route=%3B${clinica.latitud}%2C${clinica.longitud}`}>
              Cómo llegar
            </a>
          </div>
          <div className="mapa">
            <MapContainer center={[clinica.latitud, clinica.longitud]} zoom={16} style={{ height: '100%', minHeight: 520 }}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[clinica.latitud, clinica.longitud]} icon={marcador}>
                <Popup><strong>{clinica.nombre}</strong><br />{clinica.direccion}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </>
  )
}
