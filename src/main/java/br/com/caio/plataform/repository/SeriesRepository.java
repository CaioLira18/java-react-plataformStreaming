package br.com.caio.plataform.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import br.com.caio.plataform.entities.Series;

public interface SeriesRepository extends JpaRepository<Series, String> {

    // A query abaixo traz a Série e suas Temporadas em um único comando SQL
    @Query(value = "SELECT s FROM Series s LEFT JOIN FETCH s.seassonsList",
           countQuery = "SELECT count(s) FROM Series s")
    Page<Series> findAllWithSeasons(Pageable pageable);
}