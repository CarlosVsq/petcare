# PetCare — Arquitectura del producto

Sistema web para la gestión de atención veterinaria de la clínica PetCare.
Desarrollo Web Orientado a Objeto — Universidad del Bío-Bío.

Integrantes: Diego Alonso Alamos Vallejos, Carlos Alberto Vásquez Rodríguez.

## Componentes

| Carpeta | Componente | Tecnología | Puerto |
|---|---|---|---|
| `backend/` | API REST y lógica de negocio | Spring Boot + PostgreSQL | 8080 |
| `apis-externas/` | Medicamentos, ubicación y notificaciones (segundo equipo) | Node.js + Express | 3000 |

```
Backend (Spring Boot) ──▶ APIs externas (Node.js, equipo 2)
        │
        ▼
   PostgreSQL
```

## Contenido de esta entrega

- **Base de datos** (`backend/src/main/resources`):
  - `schema.sql`: creación de las tablas `clientes`, `mascotas`, `veterinarios`,
    `horarios_veterinario`, `reservas`, `atenciones` y `tratamientos`, con claves
    primarias, foráneas, restricciones y un índice único que impide reservas duplicadas
    del mismo veterinario en la misma fecha y hora.
  - `data.sql`: datos de ejemplo (clientes, mascotas, veterinarios con sus horarios,
    reservas en distintos estados e historial médico).
- **Modelos** (`model`): entidades JPA `Cliente`, `Mascota`, `Veterinario`,
  `HorarioVeterinario`, `Reserva`, `Atencion`, `Tratamiento` y los enumerados
  `EstadoReserva` y `DiaSemana`, mapeadas a las tablas del schema.
- **Repositorios** (`repository`): interfaces de Spring Data JPA de cada entidad.
- **Servicios y controladores** (`service`, `controller`): clases creadas según la
  arquitectura en capas. Su lógica y endpoints se implementarán en la siguiente etapa.
- **APIs externas** (`apis-externas/`): servidor Express con las rutas de medicamentos,
  clínica y notificaciones (vacías), y el catálogo de medicamentos.

## Estructura

```
backend/src/main/java/cl/ubb/petcare
├── controller   ClienteController, MascotaController, VeterinarioController,
│                ReservaController, MedicamentoController, ClinicaController
├── service      ClienteService, MascotaService, VeterinarioService,
│                ReservaService, ApisExternasService
├── repository   Acceso a datos (Spring Data JPA)
└── model        Entidades JPA
backend/src/main/resources
├── application.properties
├── schema.sql   Creación de tablas
└── data.sql     Datos de ejemplo
apis-externas/src
├── routes       medicamentos, clinica, notificaciones
├── data         Catálogo de medicamentos y datos de la clínica
└── server.js
```

## Relación entre modelos y base de datos

| Entidad | Tabla | Relaciones |
|---|---|---|
| `Cliente` | `clientes` | — |
| `Mascota` | `mascotas` | `@ManyToOne` a `Cliente` (`cliente_id`) |
| `Veterinario` | `veterinarios` | — |
| `HorarioVeterinario` | `horarios_veterinario` | `@ManyToOne` a `Veterinario` (`veterinario_id`) |
| `Reserva` | `reservas` | `@ManyToOne` a `Mascota` (`mascota_id`) y a `Veterinario` (`veterinario_id`) |
| `Atencion` | `atenciones` | `@OneToOne` a `Reserva` (`reserva_id`), `@OneToMany` a `Tratamiento` |
| `Tratamiento` | `tratamientos` | `@ManyToOne` a `Atencion` (`atencion_id`) |

Al iniciar, Hibernate valida (`ddl-auto=validate`) que las entidades coincidan con las
tablas creadas por `schema.sql`.

## Ejecución

### Backend

Requisitos: Java 21 o superior y PostgreSQL (o Docker para usar `compose.yaml`).
No es necesario instalar Maven: el proyecto incluye el Maven Wrapper.

```bash
cd backend
docker compose up -d          # Levanta PostgreSQL (base, usuario y clave: petcare)
./mvnw spring-boot:run        # Linux / macOS
mvnw.cmd spring-boot:run      # Windows
```

Si se usa un PostgreSQL propio, se puede indicar la conexión con las variables
`DB_URL`, `DB_USERNAME` y `DB_PASSWORD`. La dirección del servicio de APIs externas se
indica con `NODE_API_URL` (por defecto `http://localhost:3000`).

Al iniciar la aplicación, `schema.sql` recrea las tablas y `data.sql` carga los datos
de ejemplo, por lo que la base de datos se reinicia en cada ejecución.

### APIs externas (segundo equipo)

Requisitos: Node.js 20 o superior.

```bash
cd apis-externas
npm install
npm start                     # http://0.0.0.0:3000
```
