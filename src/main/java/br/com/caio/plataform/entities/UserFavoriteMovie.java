package br.com.caio.plataform.entities;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class UserFavoriteMovie implements Serializable {

    @EmbeddedId
    private UserMovieId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("movieId")
    @JoinColumn(name = "movie_id")
    private Movie movie;

    public UserFavoriteMovie() {}

    public UserFavoriteMovie(User user, Movie movie) {
        this.user = user;
        this.movie = movie;
        this.id = new UserMovieId(user.getId(), movie.getId());
    }

    public UserMovieId getId() {
        return id;
    }

    public void setId(UserMovieId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}