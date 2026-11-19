package cl.ubb.petcare.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.ubb.petcare.dto.AtencionResponse;
import cl.ubb.petcare.dto.MascotaRequest;
import cl.ubb.petcare.dto.MascotaResponse;
import cl.ubb.petcare.exception.OperacionNoPermitidaException;
import cl.ubb.petcare.exception.RecursoNoEncontradoException;
import cl.ubb.petcare.model.Cliente;
import cl.ubb.petcare.model.Mascota;
import cl.ubb.petcare.repository.AtencionRepository;
import cl.ubb.petcare.repository.ClienteRepository;
import cl.ubb.petcare.repository.MascotaRepository;
import cl.ubb.petcare.repository.ReservaRepository;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;
    private final ClienteRepository clienteRepository;
    private final ReservaRepository reservaRepository;
    private final AtencionRepository atencionRepository;

    public MascotaService(MascotaRepository mascotaRepository, ClienteRepository clienteRepository,
            ReservaRepository reservaRepository, AtencionRepository atencionRepository) {
        this.mascotaRepository = mascotaRepository;
        this.clienteRepository = clienteRepository;
        this.reservaRepository = reservaRepository;
        this.atencionRepository = atencionRepository;
    }

    @Transactional(readOnly = true)
    public List<MascotaResponse> listarPorCliente(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new RecursoNoEncontradoException("Cliente " + clienteId + " no encontrado");
        }
        return mascotaRepository.findByClienteIdOrderByIdAsc(clienteId).stream()
                .map(MascotaResponse::desde)
                .toList();
    }

    @Transactional
    public MascotaResponse registrar(Long clienteId, MascotaRequest datos) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente " + clienteId + " no encontrado"));
        Mascota mascota = new Mascota();
        mascota.setCliente(cliente);
        copiarDatos(datos, mascota);
        return MascotaResponse.desde(mascotaRepository.save(mascota));
    }

    @Transactional
    public MascotaResponse actualizar(Long id, MascotaRequest datos) {
        Mascota mascota = obtener(id);
        copiarDatos(datos, mascota);
        return MascotaResponse.desde(mascotaRepository.save(mascota));
    }

    @Transactional
    public void eliminar(Long id) {
        Mascota mascota = obtener(id);
        if (reservaRepository.existsByMascotaId(id)) {
            throw new OperacionNoPermitidaException(
                    "No se puede eliminar la mascota " + id + " porque tiene reservas registradas");
        }
        mascotaRepository.delete(mascota);
    }

    @Transactional(readOnly = true)
    public List<AtencionResponse> historial(Long id) {
        obtener(id);
        return atencionRepository.buscarHistorialDeMascota(id).stream()
                .map(AtencionResponse::desde)
                .toList();
    }

    private Mascota obtener(Long id) {
        return mascotaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Mascota " + id + " no encontrada"));
    }

    private void copiarDatos(MascotaRequest datos, Mascota mascota) {
        mascota.setNombre(datos.nombre());
        mascota.setEspecie(datos.especie());
        mascota.setRaza(datos.raza());
        mascota.setFechaNacimiento(datos.fechaNacimiento());
        mascota.setPeso(datos.peso());
    }
}
