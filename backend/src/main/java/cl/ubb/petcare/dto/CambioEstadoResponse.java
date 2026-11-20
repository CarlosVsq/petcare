package cl.ubb.petcare.dto;

import cl.ubb.petcare.model.EstadoReserva;

public record CambioEstadoResponse(
        Long id,
        EstadoReserva estado,
        boolean notificacionEnviada) {
}
