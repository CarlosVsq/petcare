package cl.ubb.petcare.model;

import java.time.LocalDate;

public enum DiaSemana {
    LUNES,
    MARTES,
    MIERCOLES,
    JUEVES,
    VIERNES,
    SABADO,
    DOMINGO;

    public static DiaSemana desde(LocalDate fecha) {
        return values()[fecha.getDayOfWeek().getValue() - 1];
    }
}
