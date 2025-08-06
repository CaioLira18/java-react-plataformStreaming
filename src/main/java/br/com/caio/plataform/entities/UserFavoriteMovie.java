package br.com.caio.plataform.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "user_favorite_movies")
public class UserFavoriteMovie {

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

    // Getters e Setters
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
