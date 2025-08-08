package br.com.caio.plataform.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.plataform.entities.Movie;
import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.repository.MovieRepository;
import br.com.caio.plataform.repository.SeriesRepository;
import br.com.caio.plataform.repository.UserRepository;

@Service
public class FavoriteService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private SeriesRepository seriesRepository;

    public void addMovieToFavorites(String userId, String movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

        if (!user.getFavoriteMovieList().contains(movie)) {
            user.getFavoriteMovieList().add(movie);
            userRepository.save(user);
        }
    }

    public void addSeriesToFavorites(String userId, String seriesId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Series series = seriesRepository.findById(seriesId)
                .orElseThrow(() -> new RuntimeException("Série não encontrada"));

        if (!user.getFavoriteSeriesList().contains(series)) {
            user.getFavoriteSeriesList().add(series);
            userRepository.save(user);
        }
    }
}
