export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export class ApiError extends Error {
  constructor(status, mensaje, detalles = []) {
    super(mensaje)
    this.status = status
    this.detalles = detalles
  }
}

async function solicitar(ruta, { method = 'GET', body, params } = {}) {
  const url = new URL(API_URL + ruta)
  Object.entries(params || {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, valor)
    }
  })
  let respuesta
  try {
    respuesta = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor de PetCare')
  }
  if (respuesta.status === 204) {
    return null
  }
  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, datos?.mensaje || `Error ${respuesta.status}`, datos?.detalles || [])
  }
  return datos
}

export const clientesApi = {
  listar: (filtros) => solicitar('/clientes', { params: filtros }),
  obtener: (id) => solicitar(`/clientes/${id}`),
  crear: (cliente) => solicitar('/clientes', { method: 'POST', body: cliente }),
  actualizar: (id, cliente) => solicitar(`/clientes/${id}`, { method: 'PUT', body: cliente }),
  eliminar: (id) => solicitar(`/clientes/${id}`, { method: 'DELETE' }),
  mascotas: (id) => solicitar(`/clientes/${id}/mascotas`),
  registrarMascota: (id, mascota) => solicitar(`/clientes/${id}/mascotas`, { method: 'POST', body: mascota }),
}

export const mascotasApi = {
  actualizar: (id, mascota) => solicitar(`/mascotas/${id}`, { method: 'PUT', body: mascota }),
  eliminar: (id) => solicitar(`/mascotas/${id}`, { method: 'DELETE' }),
  historial: (id) => solicitar(`/mascotas/${id}/historial`),
}
