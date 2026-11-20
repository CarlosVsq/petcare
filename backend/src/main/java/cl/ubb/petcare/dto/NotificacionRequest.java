package cl.ubb.petcare.dto;

import java.time.LocalDate;

public record NotificacionRequest(
        String tipo,
        String destinatario,
        String cliente,
        String mascota,
        String veterinario,
        LocalDate fecha,
        String hora) {
}
