# PetCare

Sistema web para la gestión de atención veterinaria de la clínica PetCare.
Desarrollo Web Orientado a Objeto — Universidad del Bío-Bío.

Integrantes: Diego Alonso Alamos Vallejos, Carlos Alberto Vásquez Rodríguez.

## Componentes

| Carpeta | Componente | Tecnología | Puerto |
|---|---|---|---|
| `frontend/` | Interfaz web | React + Vite | 5173 |
| `backend/` | API REST y lógica de negocio | Spring Boot + PostgreSQL | 8080 |
| `apis-externas/` | Medicamentos, ubicación y notificaciones (segundo equipo) | Node.js + Express | 3000 |
| `postman/` | Colección para probar todos los endpoints | Postman | — |

```
Navegador (React) ──▶ Backend Spring Boot (equipo 1) ──▶ APIs externas Node.js (equipo 2)
                              │
                              ▼
                         PostgreSQL
```

El frontend solo se comunica con el backend, y el backend es el único que consume las APIs externas: busca medicamentos, obtiene la
ubicación de la clínica y, al confirmar o cancelar una reserva, solicita el envío del
correo al cliente.

## Estructura

```
backend/src/main/java/cl/ubb/petcare
├── controller   Endpoints REST
├── service      Lógica de negocio y transacciones
├── repository   Acceso a datos (Spring Data JPA)
├── model        Entidades JPA
├── dto          Datos de entrada y salida de la API
├── exception    Excepciones y manejador global de errores
└── config       Configuración de CORS
backend/src/main/resources
├── application.properties
├── schema.sql   Creación de tablas
└── data.sql     Datos de ejemplo
frontend/src
├── pages        Pantallas (clientes, reservas, atención, historial, veterinarios, ubicación)
├── components   Componentes compartidos (formularios, modales, avisos)
├── services     Conexión con la API PetCare
└── utils        Formato de fechas y datos
apis-externas/src
├── routes       medicamentos, clinica, notificaciones
├── data         Catálogo de medicamentos y datos de la clínica
└── server.js
```

## Despliegue

Requisitos:

- **Equipo 1 (backend):** Java 21 o superior y PostgreSQL, o Docker/Podman para usar
  `compose.yaml`. No es necesario instalar Maven: el proyecto incluye el Maven Wrapper.
- **Equipo 1 (frontend):** Node.js 20 o superior.
- **Equipo 2 (APIs externas):** Node.js 20 o superior.

Ambos equipos deben estar conectados a la misma red.

### 1. APIs externas (equipo 2)

```bash
cd apis-externas
npm install
npm start
```

El servicio queda escuchando en `http://0.0.0.0:3000`, es decir, acepta conexiones
desde otros equipos de la red. Para conocer la IP del equipo 2:

```bash
ip addr        # Linux
ipconfig       # Windows
```

Si el firewall está activo, se debe permitir el puerto 3000.

**Correos.** Para enviar correos reales, copiar `.env.example` como `.env` e indicar una
cuenta SMTP. Con Gmail se debe usar una
[contraseña de aplicación](https://myaccount.google.com/apppasswords):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=cuenta@gmail.com
SMTP_PASS=contraseña-de-aplicacion
```

Sin `.env`, los correos se envían a un buzón de prueba de [Ethereal](https://ethereal.email).
El enlace para ver cada correo enviado aparece en la consola del servicio.

### 2. Backend (equipo 1)

```bash
cd backend
docker compose up -d                                      # PostgreSQL (base, usuario y clave: petcare)
NODE_API_URL=http://<IP-equipo-2>:3000 ./mvnw spring-boot:run
```

En Windows:

```bat
set NODE_API_URL=http://<IP-equipo-2>:3000
mvnw.cmd spring-boot:run
```

La API queda disponible en `http://<IP-equipo-1>:8080/api`.

Variables de configuración:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `NODE_API_URL` | URL del servicio de APIs externas | `http://localhost:3000` |
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/petcare` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de PostgreSQL | `petcare` / `petcare` |

Al iniciar, `schema.sql` recrea las tablas y `data.sql` carga los datos de ejemplo, por
lo que **la base de datos se reinicia en cada ejecución**. Las reservas futuras de
ejemplo se crean en la semana siguiente a la fecha de ejecución.

### 3. Frontend (equipo 1)

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173` y también en `http://<IP-equipo-1>:5173`
para los demás equipos de la red. Por defecto consume la API en `http://localhost:8080/api`.
Si se abrirá desde otro equipo, iniciar indicando la IP del equipo 1:

```bash
VITE_API_URL=http://<IP-equipo-1>:8080/api npm run dev
```

También se puede copiar `.env.example` como `.env` y cambiar `VITE_API_URL`.

### Funcionamiento sin las APIs externas

Si el servicio de APIs externas no está disponible, el backend sigue funcionando: la
búsqueda de medicamentos y la ubicación responden `503`, y las reservas se confirman o
cancelan igualmente, indicando `"notificacionEnviada": false`.

## Endpoints

### API PetCare (`http://<equipo-1>:8080/api`)

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/clientes?nombre=&rut=` | Listar clientes (filtros opcionales) | 200 |
| GET | `/clientes/{id}` | Obtener un cliente | 200, 404 |
| POST | `/clientes` | Registrar un cliente | 201, 400, 409 |
| PUT | `/clientes/{id}` | Modificar un cliente | 200, 400, 404, 409 |
| DELETE | `/clientes/{id}` | Eliminar un cliente y sus mascotas | 204, 404, 409 |
| GET | `/clientes/{id}/mascotas` | Listar las mascotas de un cliente | 200, 404 |
| POST | `/clientes/{id}/mascotas` | Registrar una mascota de un cliente | 201, 400, 404 |
| PUT | `/mascotas/{id}` | Modificar una mascota | 200, 400, 404 |
| DELETE | `/mascotas/{id}` | Eliminar una mascota | 204, 404, 409 |
| GET | `/mascotas/{id}/historial` | Historial médico de una mascota | 200, 404 |
| GET | `/veterinarios` | Listar veterinarios con su horario | 200 |
| GET | `/veterinarios/{id}/disponibilidad?fecha=` | Horarios disponibles en una fecha | 200, 400, 404 |
| GET | `/reservas?fecha=&veterinarioId=&estado=` | Listar reservas (filtros opcionales) | 200, 400 |
| POST | `/reservas` | Solicitar una hora médica | 201, 400, 404, 409 |
| PUT | `/reservas/{id}` | Modificar una reserva | 200, 400, 404, 409 |
| PATCH | `/reservas/{id}/estado` | Confirmar o cancelar una reserva (notifica al cliente) | 200, 400, 404, 409 |
| POST | `/reservas/{id}/atencion` | Registrar la atención de una reserva | 201, 400, 404, 409 |
| GET | `/medicamentos?nombre=` | Buscar medicamentos (API externa) | 200, 400, 503 |
| GET | `/clinica/ubicacion` | Ubicación de la clínica (API externa) | 200, 503 |

### APIs externas (`http://<equipo-2>:3000`)

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/medicamentos?nombre=` | Medicamentos cuyo nombre o principio activo coincide | 200, 400 |
| GET | `/clinica/ubicacion` | Dirección y coordenadas de la clínica | 200 |
| POST | `/notificaciones` | Enviar un correo de confirmación o cancelación | 202, 400, 502 |

### Reglas de las reservas

- Las horas se asignan en bloques de 30 minutos dentro del horario de cada veterinario.
- Una reserva se rechaza (`409`) si el veterinario ya tiene otra reserva activa en la misma
  fecha y hora. Otro veterinario sí puede atender en ese horario.
- Se rechaza (`400`) si la fecha es pasada o la hora está fuera del horario del veterinario.
- Estados: `PENDIENTE` → `CONFIRMADA` → `ATENDIDA`; `PENDIENTE` o `CONFIRMADA` → `CANCELADA`.
  Una reserva cancelada libera su horario.
- La regla de duplicados también se valida en la base de datos con un índice único, por
  lo que dos solicitudes simultáneas no pueden tomar la misma hora.

### Ejemplos

```http
POST /api/reservas
Content-Type: application/json

{
  "mascotaId": 1,
  "veterinarioId": 2,
  "fecha": "2026-11-23",
  "hora": "09:00",
  "motivo": "Control anual y vacunas"
}
```

```http
PATCH /api/reservas/4/estado
Content-Type: application/json

{ "estado": "CONFIRMADA" }
```

Todas las respuestas de error tienen el mismo formato:

```json
{
  "timestamp": "2026-11-23T10:15:30",
  "status": 409,
  "error": "Conflict",
  "mensaje": "El veterinario ya tiene una reserva el 2026-11-23 a las 09:00",
  "detalles": []
}
```

## Pruebas con Postman

Importar `postman/PetCare.postman_collection.json` y ejecutarla en orden con el backend
recién iniciado y el servicio de APIs externas en ejecución. Si el backend está en otro
equipo, cambiar la variable `baseUrl` de la colección. Las fechas de las reservas se
calculan automáticamente, y cada solicitud incluye tests que verifican la respuesta.
