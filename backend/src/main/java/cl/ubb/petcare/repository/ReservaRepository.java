package cl.ubb.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.ubb.petcare.model.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
}
