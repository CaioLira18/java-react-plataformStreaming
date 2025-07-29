package br.com.caio.plataform.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caio.plataform.entities.Movie;

public interface MovieRepository extends JpaRepository<Movie, String> {

}
