package cl.ubb.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.ubb.petcare.model.Mascota;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
}
