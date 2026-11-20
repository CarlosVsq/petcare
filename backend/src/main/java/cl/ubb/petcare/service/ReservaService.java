package cl.ubb.petcare.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.ubb.petcare.dto.AtencionRequest;
import cl.ubb.petcare.dto.AtencionResponse;
import cl.ubb.petcare.dto.CambioEstadoResponse;
import cl.ubb.petcare.dto.ModificarReservaRequest;
import cl.ubb.petcare.dto.NotificacionRequest;
import cl.ubb.petcare.dto.ReservaRequest;
import cl.ubb.petcare.dto.ReservaResponse;
import cl.ubb.petcare.dto.TratamientoDto;
import cl.ubb.petcare.exception.OperacionNoPermitidaException;
import cl.ubb.petcare.exception.RecursoNoEncontradoException;
import cl.ubb.petcare.exception.SolicitudInvalidaException;
import cl.ubb.petcare.model.Atencion;
import cl.ubb.petcare.model.EstadoReserva;
import cl.ubb.petcare.model.Mascota;
import cl.ubb.petcare.model.Reserva;
import cl.ubb.petcare.model.Tratamiento;
import cl.ubb.petcare.model.Veterinario;
import cl.ubb.petcare.repository.AtencionRepository;
import cl.ubb.petcare.repository.MascotaRepository;
import cl.ubb.petcare.repository.ReservaRepository;
import jakarta.persistence.criteria.Predicate;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final MascotaRepository mascotaRepository;
    private final AtencionRepository atencionRepository;
    private final VeterinarioService veterinarioService;
    private final ApisExternasService apisExternasService;

    public ReservaService(ReservaRepository reservaRepository, MascotaRepository mascotaRepository,
            AtencionRepository atencionRepository, VeterinarioService veterinarioService,
            ApisExternasService apisExternasService) {
        this.reservaRepository = reservaRepository;
        this.mascotaRepository = mascotaRepository;
        this.atencionRepository = atencionRepository;
        this.veterinarioService = veterinarioService;
        this.apisExternasService = apisExternasService;
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> listar(LocalDate fecha, Long veterinarioId, EstadoReserva estado) {
        Specification<Reserva> filtros = (root, query, cb) -> {
            List<Predicate> condiciones = new ArrayList<>();
            if (fecha != null) {
                condiciones.add(cb.equal(root.get("fecha"), fecha));
            }
            if (veterinarioId != null) {
                condiciones.add(cb.equal(root.get("veterinario").get("id"), veterinarioId));
            }
            if (estado != null) {
                condiciones.add(cb.equal(root.get("estado"), estado));
            }
            return cb.and(condiciones.toArray(new Predicate[0]));
        };
        return reservaRepository.findAll(filtros, Sort.by("fecha", "hora", "id")).stream()
                .map(ReservaResponse::desde)
                .toList();
    }

    @Transactional
    public ReservaResponse registrar(ReservaRequest solicitud) {
        Mascota mascota = mascotaRepository.findById(solicitud.mascotaId())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Mascota " + solicitud.mascotaId() + " no encontrada"));
        Veterinario veterinario = veterinarioService.obtener(solicitud.veterinarioId());
        validarHorario(veterinario, solicitud.fecha(), solicitud.hora());
        if (reservaRepository.existsByVeterinarioIdAndFechaAndHoraAndEstadoNot(veterinario.getId(),
                solicitud.fecha(), solicitud.hora(), EstadoReserva.CANCELADA)) {
            throw horarioOcupado(solicitud.fecha(), solicitud.hora());
        }

        Reserva reserva = new Reserva();
        reserva.setMascota(mascota);
        reserva.setVeterinario(veterinario);
        reserva.setFecha(solicitud.fecha());
        reserva.setHora(solicitud.hora());
        reserva.setMotivo(solicitud.motivo());
        reserva.setEstado(EstadoReserva.PENDIENTE);
        return ReservaResponse.desde(guardar(reserva));
    }

    @Transactional
    public ReservaResponse modificar(Long id, ModificarReservaRequest datos) {
        Reserva reserva = obtener(id);
        if (reserva.getEstado() != EstadoReserva.PENDIENTE && reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new OperacionNoPermitidaException(
                    "Solo se pueden modificar reservas PENDIENTE o CONFIRMADA; la reserva " + id + " está "
                            + reserva.getEstado());
        }
        Veterinario veterinario = veterinarioService.obtener(datos.veterinarioId());
        validarHorario(veterinario, datos.fecha(), datos.hora());
        if (reservaRepository.existsByVeterinarioIdAndFechaAndHoraAndEstadoNotAndIdNot(veterinario.getId(),
                datos.fecha(), datos.hora(), EstadoReserva.CANCELADA, id)) {
            throw horarioOcupado(datos.fecha(), datos.hora());
        }

        reserva.setVeterinario(veterinario);
        reserva.setFecha(datos.fecha());
        reserva.setHora(datos.hora());
        reserva.setMotivo(datos.motivo());
        return ReservaResponse.desde(guardar(reserva));
    }

    @Transactional
    public CambioEstadoResponse cambiarEstado(Long id, EstadoReserva nuevoEstado) {
        Reserva reserva = obtener(id);
        EstadoReserva actual = reserva.getEstado();
        String tipo;
        if (nuevoEstado == EstadoReserva.CONFIRMADA) {
            if (actual != EstadoReserva.PENDIENTE) {
                throw new OperacionNoPermitidaException(
                        "Solo se pueden confirmar reservas PENDIENTE; la reserva " + id + " está " + actual);
            }
            tipo = "CONFIRMACION";
        } else if (nuevoEstado == EstadoReserva.CANCELADA) {
            if (actual != EstadoReserva.PENDIENTE && actual != EstadoReserva.CONFIRMADA) {
                throw new OperacionNoPermitidaException(
                        "Solo se pueden cancelar reservas PENDIENTE o CONFIRMADA; la reserva " + id + " está "
                                + actual);
            }
            tipo = "CANCELACION";
        } else {
            throw new SolicitudInvalidaException(
                    "El estado solo puede cambiarse a CONFIRMADA o CANCELADA; ATENDIDA se asigna al registrar la atención");
        }

        reserva.setEstado(nuevoEstado);
        reservaRepository.saveAndFlush(reserva);

        Mascota mascota = reserva.getMascota();
        NotificacionRequest notificacion = new NotificacionRequest(
                tipo,
                mascota.getCliente().getCorreo(),
                mascota.getCliente().getNombre(),
                mascota.getNombre(),
                reserva.getVeterinario().getNombre(),
                reserva.getFecha(),
                reserva.getHora().toString());
        boolean enviada = apisExternasService.enviarNotificacion(notificacion);
        return new CambioEstadoResponse(reserva.getId(), reserva.getEstado(), enviada);
    }

    @Transactional
    public AtencionResponse registrarAtencion(Long id, AtencionRequest datos) {
        Reserva reserva = obtener(id);
        if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new OperacionNoPermitidaException(
                    "Solo se pueden atender reservas CONFIRMADA; la reserva " + id + " está " + reserva.getEstado());
        }

        Atencion atencion = new Atencion();
        atencion.setReserva(reserva);
        atencion.setDiagnostico(datos.diagnostico());
        atencion.setObservaciones(datos.observaciones());
        for (TratamientoDto item : datos.tratamientos()) {
            Tratamiento tratamiento = new Tratamiento();
            tratamiento.setMedicamento(item.medicamento());
            tratamiento.setDosis(item.dosis());
            tratamiento.setFrecuencia(item.frecuencia());
            tratamiento.setDuracion(item.duracion());
            atencion.agregarTratamiento(tratamiento);
        }
        reserva.setEstado(EstadoReserva.ATENDIDA);
        return AtencionResponse.desde(atencionRepository.save(atencion));
    }

    private Reserva obtener(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Reserva " + id + " no encontrada"));
    }

    private void validarHorario(Veterinario veterinario, LocalDate fecha, LocalTime hora) {
        if (!fecha.atTime(hora).isAfter(LocalDateTime.now())) {
            throw new SolicitudInvalidaException("La fecha y hora de la reserva deben ser futuras");
        }
        if (!veterinarioService.esBloqueDeAtencion(veterinario.getId(), fecha, hora)) {
            throw new SolicitudInvalidaException("La hora " + hora + " del " + fecha
                    + " está fuera del horario de atención de " + veterinario.getNombre());
        }
    }

    private Reserva guardar(Reserva reserva) {
        try {
            return reservaRepository.saveAndFlush(reserva);
        } catch (DataIntegrityViolationException ex) {
            throw horarioOcupado(reserva.getFecha(), reserva.getHora());
        }
    }

    private OperacionNoPermitidaException horarioOcupado(LocalDate fecha, LocalTime hora) {
        return new OperacionNoPermitidaException(
                "El veterinario ya tiene una reserva el " + fecha + " a las " + hora);
    }
}
