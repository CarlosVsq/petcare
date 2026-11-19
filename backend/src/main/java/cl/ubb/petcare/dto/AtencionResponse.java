package cl.ubb.petcare.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import cl.ubb.petcare.model.Atencion;
import cl.ubb.petcare.model.Reserva;

public record AtencionResponse(
        Long atencionId,
        Long reservaId,
        LocalDate fecha,
        @JsonFormat(pattern = "HH:mm") LocalTime hora,
        String veterinario,
        String motivo,
        String diagnostico,
        String observaciones,
        List<TratamientoDto> tratamientos) {

    public static AtencionResponse desde(Atencion atencion) {
        Reserva reserva = atencion.getReserva();
        return new AtencionResponse(
                atencion.getId(),
                reserva.getId(),
                reserva.getFecha(),
                reserva.getHora(),
                reserva.getVeterinario().getNombre(),
                reserva.getMotivo(),
                atencion.getDiagnostico(),
                atencion.getObservaciones(),
                atencion.getTratamientos().stream().map(TratamientoDto::desde).toList());
    }
}
