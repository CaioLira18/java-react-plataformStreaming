package br.com.caio.plataform.controllers;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.caio.plataform.entities.Movie;
import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.repository.MovieRepository;
import br.com.caio.plataform.repository.SeriesRepository;
import br.com.caio.plataform.repository.UserRepository;


@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173") 
public class FavoriteController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @PostMapping("/movie/{movieId}/{userId}")
    public ResponseEntity<?> addMovieToFavorites(
            @PathVariable String userId, 
            @PathVariable String movieId) {
        
        System.out.println("=== DEBUG: Adicionando filme aos favoritos ===");
        System.out.println("User ID: " + userId);
        System.out.println("Movie ID: " + movieId);
        
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            Optional<Movie> optionalMovie = movieRepository.findById(movieId);

            if (optionalUser.isEmpty()) {
                System.out.println("❌ Usuário não encontrado: " + userId);
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }
            
            if (optionalMovie.isEmpty()) {
                System.out.println("❌ Filme não encontrado: " + movieId);
                return ResponseEntity.status(404).body("Filme não encontrado");
            }

            User user = optionalUser.get();
            Movie movie = optionalMovie.get();
            
            System.out.println("✅ Usuário encontrado: " + user.getName());
            System.out.println("✅ Filme encontrado: " + movie.getName());

            if (!user.getFavoriteMovieList().contains(movie)) {
                user.getFavoriteMovieList().add(movie);
                userRepository.save(user);
                System.out.println("✅ Filme adicionado aos favoritos!");
                return ResponseEntity.ok().body("Filme adicionado aos favoritos com sucesso");
            } else {
                System.out.println("ℹ️ Filme já estava nos favoritos");
                return ResponseEntity.ok().body("Filme já está nos favoritos");
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }

    @DeleteMapping("/movie/{movieId}/{userId}")
    public ResponseEntity<?> removeMovieFromFavorites(
            @PathVariable String userId, 
            @PathVariable String movieId) {
        
        System.out.println("=== DEBUG: Removendo filme dos favoritos ===");
        System.out.println("User ID: " + userId);
        System.out.println("Movie ID: " + movieId);
        
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            Optional<Movie> optionalMovie = movieRepository.findById(movieId);

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }
            
            if (optionalMovie.isEmpty()) {
                return ResponseEntity.status(404).body("Filme não encontrado");
            }

            User user = optionalUser.get();
            Movie movie = optionalMovie.get();

            boolean removed = user.getFavoriteMovieList().remove(movie);
            if (removed) {
                userRepository.save(user);
                System.out.println("✅ Filme removido dos favoritos!");
                return ResponseEntity.ok().body("Filme removido dos favoritos com sucesso");
            } else {
                System.out.println("ℹ️ Filme não estava nos favoritos");
                return ResponseEntity.ok().body("Filme não estava nos favoritos");
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }
}