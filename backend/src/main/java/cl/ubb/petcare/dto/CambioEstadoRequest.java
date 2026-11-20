package cl.ubb.petcare.dto;

import cl.ubb.petcare.model.EstadoReserva;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoRequest(@NotNull EstadoReserva estado) {
}
