package br.com.caio.plataform.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caio.plataform.entities.Series;

public interface SeriesRepository extends JpaRepository<Series, String> {

}
