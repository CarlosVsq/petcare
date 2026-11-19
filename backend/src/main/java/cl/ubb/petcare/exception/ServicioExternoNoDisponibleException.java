package cl.ubb.petcare.exception;

public class ServicioExternoNoDisponibleException extends RuntimeException {

    public ServicioExternoNoDisponibleException(String mensaje) {
        super(mensaje);
    }
}
