package cl.ubb.petcare.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.ubb.petcare.exception.OperacionNoPermitidaException;
import cl.ubb.petcare.exception.RecursoNoEncontradoException;
import cl.ubb.petcare.model.Cliente;
import cl.ubb.petcare.repository.ClienteRepository;
import cl.ubb.petcare.repository.ReservaRepository;
import jakarta.persistence.criteria.Predicate;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ReservaRepository reservaRepository;

    public ClienteService(ClienteRepository clienteRepository, ReservaRepository reservaRepository) {
        this.clienteRepository = clienteRepository;
        this.reservaRepository = reservaRepository;
    }

    @Transactional(readOnly = true)
    public List<Cliente> listar(String nombre, String rut) {
        Specification<Cliente> filtros = (root, query, cb) -> {
            List<Predicate> condiciones = new ArrayList<>();
            if (nombre != null && !nombre.isBlank()) {
                condiciones.add(cb.like(cb.lower(root.get("nombre")), "%" + nombre.trim().toLowerCase() + "%"));
            }
            if (rut != null && !rut.isBlank()) {
                condiciones.add(cb.like(cb.lower(root.get("rut")), "%" + rut.trim().toLowerCase() + "%"));
            }
            return cb.and(condiciones.toArray(new Predicate[0]));
        };
        return clienteRepository.findAll(filtros, Sort.by("id"));
    }

    @Transactional(readOnly = true)
    public Cliente obtener(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente " + id + " no encontrado"));
    }

    @Transactional
    public Cliente crear(Cliente cliente) {
        if (clienteRepository.existsByRut(cliente.getRut())) {
            throw new OperacionNoPermitidaException("Ya existe un cliente con el RUT " + cliente.getRut());
        }
        cliente.setId(null);
        return clienteRepository.save(cliente);
    }

    @Transactional
    public Cliente actualizar(Long id, Cliente datos) {
        Cliente cliente = obtener(id);
        if (clienteRepository.existsByRutAndIdNot(datos.getRut(), id)) {
            throw new OperacionNoPermitidaException("Ya existe un cliente con el RUT " + datos.getRut());
        }
        cliente.setRut(datos.getRut());
        cliente.setNombre(datos.getNombre());
        cliente.setCorreo(datos.getCorreo());
        cliente.setTelefono(datos.getTelefono());
        cliente.setDireccion(datos.getDireccion());
        return clienteRepository.save(cliente);
    }

    @Transactional
    public void eliminar(Long id) {
        Cliente cliente = obtener(id);
        if (reservaRepository.existsByMascotaClienteId(id)) {
            throw new OperacionNoPermitidaException(
                    "No se puede eliminar el cliente " + id + " porque sus mascotas tienen reservas registradas");
        }
        clienteRepository.delete(cliente);
    }
}
