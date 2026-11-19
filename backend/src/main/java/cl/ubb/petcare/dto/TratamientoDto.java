package cl.ubb.petcare.dto;

import cl.ubb.petcare.model.Tratamiento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TratamientoDto(
        @NotBlank @Size(max = 150) String medicamento,
        @NotBlank @Size(max = 100) String dosis,
        @NotBlank @Size(max = 100) String frecuencia,
        @NotBlank @Size(max = 100) String duracion) {

    public static TratamientoDto desde(Tratamiento tratamiento) {
        return new TratamientoDto(
                tratamiento.getMedicamento(),
                tratamiento.getDosis(),
                tratamiento.getFrecuencia(),
                tratamiento.getDuracion());
    }
}
