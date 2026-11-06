package cl.ubb.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.ubb.petcare.model.HorarioVeterinario;

@Repository
public interface HorarioVeterinarioRepository extends JpaRepository<HorarioVeterinario, Long> {
}
