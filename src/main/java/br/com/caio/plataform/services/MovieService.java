package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.caio.plataform.entities.Movie;
import br.com.caio.plataform.repository.MovieRepository;
import org.springframework.cache.annotation.Cacheable;

@Service
public class MovieService {
    private MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie insert(@RequestBody Movie movie) {
        return movieRepository.save(movie);
    }

    public Optional<Movie> findById(String id){
        return movieRepository.findById(id);
    }

    @Cacheable("movies")
    public Page<Movie> findAll(Pageable pageable){
        return movieRepository.findAll(pageable);
    }

    public Movie update(String id, Movie movie){
        Optional<Movie> existingMovie = movieRepository.findById(id);
        if(existingMovie.isPresent()){
            Movie moviesToUpdate = existingMovie.get();
            moviesToUpdate.setName(movie.getName());
            moviesToUpdate.setCategory(movie.getCategory());
            moviesToUpdate.setDuration(movie.getDuration());
            moviesToUpdate.setDescription(movie.getDescription());
            moviesToUpdate.setYear(movie.getYear());
            moviesToUpdate.setType(movie.getType());
            moviesToUpdate.setAge(movie.getAge());
            moviesToUpdate.setYoutubelink(movie.getYoutubelink());
            moviesToUpdate.setFranquia(movie.getFranquia());
            moviesToUpdate.setMarca(movie.getMarca());
            moviesToUpdate.setImage(movie.getImage());
            moviesToUpdate.setImage1(movie.getImage1());
            moviesToUpdate.setImage2(movie.getImage2());
            moviesToUpdate.setImage3(movie.getImage3());

            return movieRepository.save(moviesToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id){
        if(movieRepository.existsById(id)){
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
