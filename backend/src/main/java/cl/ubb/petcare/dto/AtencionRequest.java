package cl.ubb.petcare.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AtencionRequest(
        @NotBlank @Size(max = 500) String diagnostico,
        @Size(max = 500) String observaciones,
        @NotNull List<@Valid @NotNull TratamientoDto> tratamientos) {
}
