package br.com.caio.plataform.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.caio.plataform.entities.UserFavoriteMovie;
import br.com.caio.plataform.entities.UserMovieId;

@Repository
public interface UserFavoriteMovieRepository extends JpaRepository<UserFavoriteMovie, UserMovieId> {
    
}
