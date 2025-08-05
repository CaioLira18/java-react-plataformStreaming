package br.com.caio.plataform.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.caio.plataform.entities.Movie;
import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.services.MovieService;
import br.com.caio.plataform.services.SeriesService;
import br.com.caio.plataform.services.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    private MovieService movieService;

    @Autowired
    private SeriesService seriesService; // Mudança: SerieService em vez de SeassonsService

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.insert(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.findById(id);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        if (updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        boolean deleted = userService.deleteById(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                       : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/{userId}/favorites")
    public ResponseEntity<User> addFavorite(@PathVariable String userId, @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userService.findById(userId);
        if (!userOpt.isPresent()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        User user = userOpt.get();
        String movieId = body.get("movieId");
        String serieId = body.get("serieId"); // Mudança: serieId em vez de seassonId

        if (movieId != null) {
            Optional<Movie> movieOpt = movieService.findById(movieId);
            if (movieOpt.isPresent()) {
                Movie movie = movieOpt.get();
                if (!user.getFavoriteMovieList().contains(movie)) {
                    user.getFavoriteMovieList().add(movie);
                    User updatedUser = userService.update(userId, user);
                    return new ResponseEntity<>(updatedUser, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(user, HttpStatus.OK); // já está na lista
                }
            }
        }

        if (serieId != null) {
            Optional<Series> serieOpt = seriesService.findById(serieId);
            if (serieOpt.isPresent()) {
                Series serie = serieOpt.get();
                if (!user.getFavoriteSerieList().contains(serie)) {
                    user.getFavoriteSerieList().add(serie);
                    User updatedUser = userService.update(userId, user);
                    return new ResponseEntity<>(updatedUser, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(user, HttpStatus.OK); // já está na lista
                }
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // REMOVER FILME DOS FAVORITOS
    @DeleteMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<User> removeFavoriteMovie(@PathVariable String userId, @PathVariable String movieId) {
        Optional<User> userOpt = userService.findById(userId);
        Optional<Movie> movieOpt = movieService.findById(movieId);

        if (userOpt.isPresent() && movieOpt.isPresent()) {
            User user = userOpt.get();
            Movie movie = movieOpt.get();

            user.getFavoriteMovieList().remove(movie);
            User updatedUser = userService.update(userId, user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // ALTERADO: REMOVER SÉRIE DOS FAVORITOS
    @DeleteMapping("/{userId}/favorites-serie/{serieId}")
    public ResponseEntity<User> removeFavoriteSerie(@PathVariable String userId, @PathVariable String serieId) {
        Optional<User> userOpt = userService.findById(userId);
        Optional<Series> serieOpt = seriesService.findById(serieId);
        
        if (userOpt.isPresent() && serieOpt.isPresent()) {
            User user = userOpt.get();
            Series serie = serieOpt.get();
            
            user.getFavoriteSerieList().remove(serie);
            User updatedUser = userService.update(userId, user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }
        
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}