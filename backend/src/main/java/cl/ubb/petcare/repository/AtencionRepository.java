package cl.ubb.petcare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import cl.ubb.petcare.model.Atencion;

@Repository
public interface AtencionRepository extends JpaRepository<Atencion, Long> {

    @Query("SELECT a FROM Atencion a JOIN FETCH a.reserva r JOIN FETCH r.veterinario "
            + "WHERE r.mascota.id = :mascotaId ORDER BY r.fecha DESC, r.hora DESC")
    List<Atencion> buscarHistorialDeMascota(@Param("mascotaId") Long mascotaId);
}
