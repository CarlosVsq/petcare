package cl.ubb.petcare.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

public record MascotaRequest(
        @NotBlank @Size(max = 80) String nombre,
        @NotBlank @Size(max = 50) String especie,
        @Size(max = 80) String raza,
        @NotNull @PastOrPresent LocalDate fechaNacimiento,
        @NotNull @DecimalMin("0.01") @DecimalMax("999.99") BigDecimal peso) {
}
