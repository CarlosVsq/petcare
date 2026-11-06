package cl.ubb.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.ubb.petcare.model.Atencion;

@Repository
public interface AtencionRepository extends JpaRepository<Atencion, Long> {
}
