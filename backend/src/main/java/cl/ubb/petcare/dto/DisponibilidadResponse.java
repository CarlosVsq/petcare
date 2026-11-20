package cl.ubb.petcare.dto;

import java.time.LocalDate;
import java.util.List;

public record DisponibilidadResponse(
        Long veterinarioId,
        LocalDate fecha,
        List<String> horariosDisponibles) {
}
