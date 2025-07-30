package br.com.caio.plataform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caio.plataform.entities.Seassons;

public interface SeassonsRepository extends JpaRepository<Seassons, String> {
    List<Seassons> findBySeriesId(String seriesId);
}
