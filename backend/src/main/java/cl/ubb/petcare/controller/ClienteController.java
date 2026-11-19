package cl.ubb.petcare.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.ubb.petcare.dto.MascotaRequest;
import cl.ubb.petcare.dto.MascotaResponse;
import cl.ubb.petcare.model.Cliente;
import cl.ubb.petcare.service.ClienteService;
import cl.ubb.petcare.service.MascotaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final MascotaService mascotaService;

    public ClienteController(ClienteService clienteService, MascotaService mascotaService) {
        this.clienteService = clienteService;
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public List<Cliente> listar(@RequestParam(required = false) String nombre,
            @RequestParam(required = false) String rut) {
        return clienteService.listar(nombre, rut);
    }

    @GetMapping("/{id}")
    public Cliente obtener(@PathVariable Long id) {
        return clienteService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente crear(@Valid @RequestBody Cliente cliente) {
        return clienteService.crear(cliente);
    }

    @PutMapping("/{id}")
    public Cliente actualizar(@PathVariable Long id, @Valid @RequestBody Cliente cliente) {
        return clienteService.actualizar(id, cliente);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
    }

    @GetMapping("/{id}/mascotas")
    public List<MascotaResponse> listarMascotas(@PathVariable Long id) {
        return mascotaService.listarPorCliente(id);
    }

    @PostMapping("/{id}/mascotas")
    @ResponseStatus(HttpStatus.CREATED)
    public MascotaResponse registrarMascota(@PathVariable Long id, @Valid @RequestBody MascotaRequest mascota) {
        return mascotaService.registrar(id, mascota);
    }
}
