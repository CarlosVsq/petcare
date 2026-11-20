package cl.ubb.petcare.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.ubb.petcare.dto.DisponibilidadResponse;
import cl.ubb.petcare.dto.VeterinarioResponse;
import cl.ubb.petcare.service.VeterinarioService;

@RestController
@RequestMapping("/api/veterinarios")
public class VeterinarioController {

    private final VeterinarioService veterinarioService;

    public VeterinarioController(VeterinarioService veterinarioService) {
        this.veterinarioService = veterinarioService;
    }

    @GetMapping
    public List<VeterinarioResponse> listar() {
        return veterinarioService.listar();
    }

    @GetMapping("/{id}/disponibilidad")
    public DisponibilidadResponse disponibilidad(@PathVariable Long id, @RequestParam LocalDate fecha) {
        return veterinarioService.disponibilidad(id, fecha);
    }
}
