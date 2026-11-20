package cl.ubb.petcare.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.ubb.petcare.dto.UbicacionResponse;
import cl.ubb.petcare.service.ApisExternasService;

@RestController
@RequestMapping("/api/clinica")
public class ClinicaController {

    private final ApisExternasService apisExternasService;

    public ClinicaController(ApisExternasService apisExternasService) {
        this.apisExternasService = apisExternasService;
    }

    @GetMapping("/ubicacion")
    public UbicacionResponse ubicacion() {
        return apisExternasService.obtenerUbicacionClinica();
    }
}
