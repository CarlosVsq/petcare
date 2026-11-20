package cl.ubb.petcare.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.ubb.petcare.dto.MedicamentoResponse;
import cl.ubb.petcare.service.ApisExternasService;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

    private final ApisExternasService apisExternasService;

    public MedicamentoController(ApisExternasService apisExternasService) {
        this.apisExternasService = apisExternasService;
    }

    @GetMapping
    public List<MedicamentoResponse> buscar(@RequestParam String nombre) {
        return apisExternasService.buscarMedicamentos(nombre);
    }
}
