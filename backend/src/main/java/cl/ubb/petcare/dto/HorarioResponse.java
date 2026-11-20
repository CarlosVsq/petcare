package cl.ubb.petcare.dto;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import cl.ubb.petcare.model.DiaSemana;
import cl.ubb.petcare.model.HorarioVeterinario;

public record HorarioResponse(
        DiaSemana diaSemana,
        @JsonFormat(pattern = "HH:mm") LocalTime horaInicio,
        @JsonFormat(pattern = "HH:mm") LocalTime horaFin) {

    public static HorarioResponse desde(HorarioVeterinario horario) {
        return new HorarioResponse(horario.getDiaSemana(), horario.getHoraInicio(), horario.getHoraFin());
    }
}
