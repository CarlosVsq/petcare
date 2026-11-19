const DIAS = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']

export const NOMBRES_DIAS = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
}

export function formatearFecha(fecha) {
  if (!fecha) {
    return ''
  }
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}-${mes}-${anio}`
}

export function fechaLarga(fecha) {
  if (!fecha) {
    return ''
  }
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function diaSemana(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return DIAS[new Date(anio, mes - 1, dia).getDay()]
}

export function hoyIso() {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
}

export function edad(fechaNacimiento) {
  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number)
  const hoy = new Date()
  let anios = hoy.getFullYear() - anio
  let meses = hoy.getMonth() + 1 - mes
  if (hoy.getDate() < dia) {
    meses -= 1
  }
  if (meses < 0) {
    anios -= 1
    meses += 12
  }
  if (anios > 0) {
    return `${anios} ${anios === 1 ? 'año' : 'años'}`
  }
  return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
}

export function formatearPeso(peso) {
  return `${Number(peso).toLocaleString('es-CL')} kg`
}
