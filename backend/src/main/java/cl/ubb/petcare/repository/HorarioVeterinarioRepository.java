package cl.ubb.petcare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.ubb.petcare.model.DiaSemana;
import cl.ubb.petcare.model.HorarioVeterinario;

@Repository
public interface HorarioVeterinarioRepository extends JpaRepository<HorarioVeterinario, Long> {

    List<HorarioVeterinario> findByVeterinarioId(Long veterinarioId);

    List<HorarioVeterinario> findByVeterinarioIdAndDiaSemana(Long veterinarioId, DiaSemana diaSemana);
}
