package cl.ubb.petcare.service;

import java.time.Duration;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import cl.ubb.petcare.dto.MedicamentoResponse;
import cl.ubb.petcare.dto.NotificacionRequest;
import cl.ubb.petcare.dto.UbicacionResponse;
import cl.ubb.petcare.exception.ServicioExternoNoDisponibleException;
import cl.ubb.petcare.exception.SolicitudInvalidaException;

@Service
public class ApisExternasService {

    private static final Logger log = LoggerFactory.getLogger(ApisExternasService.class);

    private final RestClient restClient;

    public ApisExternasService(@Value("${apis.externas.url}") String urlBase) {
        SimpleClientHttpRequestFactory fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(Duration.ofSeconds(3));
        fabrica.setReadTimeout(Duration.ofSeconds(15));
        this.restClient = RestClient.builder()
                .baseUrl(urlBase)
                .requestFactory(fabrica)
                .build();
    }

    public List<MedicamentoResponse> buscarMedicamentos(String nombre) {
        if (nombre.isBlank()) {
            throw new SolicitudInvalidaException("Debe indicar el nombre del medicamento");
        }
        try {
            List<MedicamentoResponse> medicamentos = restClient.get()
                    .uri(uri -> uri.path("/medicamentos").queryParam("nombre", nombre.trim()).build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<MedicamentoResponse>>() {
                    });
            return medicamentos == null ? List.of() : medicamentos;
        } catch (RestClientException ex) {
            throw new ServicioExternoNoDisponibleException("La API externa de medicamentos no está disponible");
        }
    }

    public UbicacionResponse obtenerUbicacionClinica() {
        try {
            return restClient.get()
                    .uri("/clinica/ubicacion")
                    .retrieve()
                    .body(UbicacionResponse.class);
        } catch (RestClientException ex) {
            throw new ServicioExternoNoDisponibleException("La API externa de geolocalización no está disponible");
        }
    }

    public boolean enviarNotificacion(NotificacionRequest notificacion) {
        try {
            restClient.post()
                    .uri("/notificaciones")
                    .body(notificacion)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (RestClientException ex) {
            log.warn("No se pudo enviar la notificación a {}: {}", notificacion.destinatario(), ex.getMessage());
            return false;
        }
    }
}
