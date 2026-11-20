package cl.ubb.petcare.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ModificarReservaRequest(
        @NotNull Long veterinarioId,
        @NotNull LocalDate fecha,
        @NotNull LocalTime hora,
        @NotBlank @Size(max = 255) String motivo) {
}
