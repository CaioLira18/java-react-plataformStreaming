package br.com.caio.plataform.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.caio.plataform.entities.UserFavoriteMovies;
import br.com.caio.plataform.entities.UserFavoriteMoviesId;


@Repository
public interface UserFavoriteMovieRepository extends JpaRepository<UserFavoriteMovies, UserFavoriteMoviesId> {
    
}
