package cl.ubb.petcare.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.ubb.petcare.dto.AtencionResponse;
import cl.ubb.petcare.dto.MascotaRequest;
import cl.ubb.petcare.dto.MascotaResponse;
import cl.ubb.petcare.service.MascotaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @PutMapping("/{id}")
    public MascotaResponse actualizar(@PathVariable Long id, @Valid @RequestBody MascotaRequest mascota) {
        return mascotaService.actualizar(id, mascota);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        mascotaService.eliminar(id);
    }

    @GetMapping("/{id}/historial")
    public List<AtencionResponse> historial(@PathVariable Long id) {
        return mascotaService.historial(id);
    }
}
