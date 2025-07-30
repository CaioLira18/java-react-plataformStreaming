package br.com.caio.plataform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caio.plataform.entities.Episodes;

public interface EpisodeRepository extends JpaRepository<Episodes, String> {
    List<Episodes> findBySeasonId(String seasonId);
}
