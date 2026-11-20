package cl.ubb.petcare.dto;

import java.util.List;

public record MedicamentoResponse(
        String nombre,
        String principioActivo,
        String presentacion,
        List<String> especies,
        String indicaciones) {
}
