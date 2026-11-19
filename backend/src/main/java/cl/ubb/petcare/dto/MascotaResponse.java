package cl.ubb.petcare.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import cl.ubb.petcare.model.Mascota;

public record MascotaResponse(
        Long id,
        Long clienteId,
        String nombre,
        String especie,
        String raza,
        LocalDate fechaNacimiento,
        BigDecimal peso) {

    public static MascotaResponse desde(Mascota mascota) {
        return new MascotaResponse(
                mascota.getId(),
                mascota.getCliente().getId(),
                mascota.getNombre(),
                mascota.getEspecie(),
                mascota.getRaza(),
                mascota.getFechaNacimiento(),
                mascota.getPeso());
    }
}
