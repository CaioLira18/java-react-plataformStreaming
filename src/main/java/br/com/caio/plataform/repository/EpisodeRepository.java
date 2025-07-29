package br.com.caio.plataform.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caio.plataform.entities.Episodes;

public interface EpisodeRepository extends JpaRepository<Episodes, String> {

}
