package cl.ubb.petcare.dto;

public record UbicacionResponse(
        String nombre,
        String direccion,
        Double latitud,
        Double longitud) {
}
