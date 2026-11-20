package cl.ubb.petcare.dto;

import java.util.List;

import cl.ubb.petcare.model.Veterinario;

public record VeterinarioResponse(
        Long id,
        String nombre,
        String especialidad,
        String correo,
        List<HorarioResponse> horarios) {

    public static VeterinarioResponse desde(Veterinario veterinario, List<HorarioResponse> horarios) {
        return new VeterinarioResponse(
                veterinario.getId(),
                veterinario.getNombre(),
                veterinario.getEspecialidad(),
                veterinario.getCorreo(),
                horarios);
    }
}
