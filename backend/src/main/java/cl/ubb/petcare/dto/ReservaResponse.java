package cl.ubb.petcare.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import cl.ubb.petcare.model.EstadoReserva;
import cl.ubb.petcare.model.Reserva;

public record ReservaResponse(
        Long id,
        Long mascotaId,
        String mascota,
        Long clienteId,
        String cliente,
        Long veterinarioId,
        String veterinario,
        LocalDate fecha,
        @JsonFormat(pattern = "HH:mm") LocalTime hora,
        String motivo,
        EstadoReserva estado) {

    public static ReservaResponse desde(Reserva reserva) {
        return new ReservaResponse(
                reserva.getId(),
                reserva.getMascota().getId(),
                reserva.getMascota().getNombre(),
                reserva.getMascota().getCliente().getId(),
                reserva.getMascota().getCliente().getNombre(),
                reserva.getVeterinario().getId(),
                reserva.getVeterinario().getNombre(),
                reserva.getFecha(),
                reserva.getHora(),
                reserva.getMotivo(),
                reserva.getEstado());
    }
}
