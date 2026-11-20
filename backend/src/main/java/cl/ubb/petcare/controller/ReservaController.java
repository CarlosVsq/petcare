package cl.ubb.petcare.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.ubb.petcare.dto.AtencionRequest;
import cl.ubb.petcare.dto.AtencionResponse;
import cl.ubb.petcare.dto.CambioEstadoRequest;
import cl.ubb.petcare.dto.CambioEstadoResponse;
import cl.ubb.petcare.dto.ModificarReservaRequest;
import cl.ubb.petcare.dto.ReservaRequest;
import cl.ubb.petcare.dto.ReservaResponse;
import cl.ubb.petcare.model.EstadoReserva;
import cl.ubb.petcare.service.ReservaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public List<ReservaResponse> listar(@RequestParam(required = false) LocalDate fecha,
            @RequestParam(required = false) Long veterinarioId,
            @RequestParam(required = false) EstadoReserva estado) {
        return reservaService.listar(fecha, veterinarioId, estado);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaResponse registrar(@Valid @RequestBody ReservaRequest solicitud) {
        return reservaService.registrar(solicitud);
    }

    @PutMapping("/{id}")
    public ReservaResponse modificar(@PathVariable Long id, @Valid @RequestBody ModificarReservaRequest datos) {
        return reservaService.modificar(id, datos);
    }

    @PatchMapping("/{id}/estado")
    public CambioEstadoResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstadoRequest solicitud) {
        return reservaService.cambiarEstado(id, solicitud.estado());
    }

    @PostMapping("/{id}/atencion")
    @ResponseStatus(HttpStatus.CREATED)
    public AtencionResponse registrarAtencion(@PathVariable Long id, @Valid @RequestBody AtencionRequest datos) {
        return reservaService.registrarAtencion(id, datos);
    }
}
