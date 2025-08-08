package br.com.caio.plataform.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.caio.plataform.entities.UserFavoriteSeries;
import br.com.caio.plataform.entities.UserFavoriteSeriesId;

@Repository
public interface UserFavoriteSerieRepository extends JpaRepository<UserFavoriteSeries, UserFavoriteSeriesId> {
    
}
