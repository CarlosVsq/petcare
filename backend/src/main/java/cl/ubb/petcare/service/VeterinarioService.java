package cl.ubb.petcare.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.ubb.petcare.dto.DisponibilidadResponse;
import cl.ubb.petcare.dto.HorarioResponse;
import cl.ubb.petcare.dto.VeterinarioResponse;
import cl.ubb.petcare.exception.RecursoNoEncontradoException;
import cl.ubb.petcare.model.DiaSemana;
import cl.ubb.petcare.model.EstadoReserva;
import cl.ubb.petcare.model.HorarioVeterinario;
import cl.ubb.petcare.model.Reserva;
import cl.ubb.petcare.model.Veterinario;
import cl.ubb.petcare.repository.HorarioVeterinarioRepository;
import cl.ubb.petcare.repository.ReservaRepository;
import cl.ubb.petcare.repository.VeterinarioRepository;

@Service
public class VeterinarioService {

    private static final int MINUTOS_POR_BLOQUE = 30;

    private final VeterinarioRepository veterinarioRepository;
    private final HorarioVeterinarioRepository horarioRepository;
    private final ReservaRepository reservaRepository;

    public VeterinarioService(VeterinarioRepository veterinarioRepository,
            HorarioVeterinarioRepository horarioRepository, ReservaRepository reservaRepository) {
        this.veterinarioRepository = veterinarioRepository;
        this.horarioRepository = horarioRepository;
        this.reservaRepository = reservaRepository;
    }

    @Transactional(readOnly = true)
    public List<VeterinarioResponse> listar() {
        List<VeterinarioResponse> veterinarios = new ArrayList<>();
        for (Veterinario veterinario : veterinarioRepository.findAll(Sort.by("id"))) {
            List<HorarioResponse> horarios = horarioRepository.findByVeterinarioId(veterinario.getId()).stream()
                    .sorted(Comparator.comparing(HorarioVeterinario::getDiaSemana)
                            .thenComparing(HorarioVeterinario::getHoraInicio))
                    .map(HorarioResponse::desde)
                    .toList();
            veterinarios.add(VeterinarioResponse.desde(veterinario, horarios));
        }
        return veterinarios;
    }

    @Transactional(readOnly = true)
    public Veterinario obtener(Long id) {
        return veterinarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Veterinario " + id + " no encontrado"));
    }

    @Transactional(readOnly = true)
    public DisponibilidadResponse disponibilidad(Long id, LocalDate fecha) {
        obtener(id);
        List<LocalTime> ocupados = reservaRepository
                .findByVeterinarioIdAndFechaAndEstadoNot(id, fecha, EstadoReserva.CANCELADA).stream()
                .map(Reserva::getHora)
                .toList();
        LocalDateTime ahora = LocalDateTime.now();
        List<String> disponibles = bloquesDelDia(id, fecha).stream()
                .filter(hora -> !ocupados.contains(hora))
                .filter(hora -> fecha.atTime(hora).isAfter(ahora))
                .map(LocalTime::toString)
                .toList();
        return new DisponibilidadResponse(id, fecha, disponibles);
    }

    @Transactional(readOnly = true)
    public boolean esBloqueDeAtencion(Long veterinarioId, LocalDate fecha, LocalTime hora) {
        return bloquesDelDia(veterinarioId, fecha).contains(hora);
    }

    private List<LocalTime> bloquesDelDia(Long veterinarioId, LocalDate fecha) {
        List<LocalTime> bloques = new ArrayList<>();
        for (HorarioVeterinario horario : horarioRepository.findByVeterinarioIdAndDiaSemana(veterinarioId,
                DiaSemana.desde(fecha))) {
            for (LocalTime hora = horario.getHoraInicio();
                    !hora.plusMinutes(MINUTOS_POR_BLOQUE).isAfter(horario.getHoraFin());
                    hora = hora.plusMinutes(MINUTOS_POR_BLOQUE)) {
                bloques.add(hora);
            }
        }
        bloques.sort(null);
        return bloques;
    }
}
