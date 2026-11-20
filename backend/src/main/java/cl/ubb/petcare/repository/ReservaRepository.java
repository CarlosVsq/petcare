package cl.ubb.petcare.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import cl.ubb.petcare.model.EstadoReserva;
import cl.ubb.petcare.model.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long>, JpaSpecificationExecutor<Reserva> {

    boolean existsByVeterinarioIdAndFechaAndHoraAndEstadoNot(Long veterinarioId, LocalDate fecha, LocalTime hora,
            EstadoReserva estado);

    boolean existsByVeterinarioIdAndFechaAndHoraAndEstadoNotAndIdNot(Long veterinarioId, LocalDate fecha,
            LocalTime hora, EstadoReserva estado, Long id);

    List<Reserva> findByVeterinarioIdAndFechaAndEstadoNot(Long veterinarioId, LocalDate fecha, EstadoReserva estado);

    boolean existsByMascotaId(Long mascotaId);

    boolean existsByMascotaClienteId(Long clienteId);
}
