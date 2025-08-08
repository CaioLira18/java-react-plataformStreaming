package br.com.caio.plataform.entities;

import java.util.Date;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_user_favorite_movies")
public class UserFavoriteMovies {

    @EmbeddedId
    private UserFavoriteMoviesId id = new UserFavoriteMoviesId();

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("moviesId") 
    private Movie movie; 

    private Date favoritedAt = new Date();

    // Construtores
    public UserFavoriteMovies() {
    }

    public UserFavoriteMovies(UserFavoriteMoviesId id, User user, Movie movie, Date favoritedAt) {
        this.id = id;
        this.user = user;
        this.movie = movie;
        this.favoritedAt = favoritedAt;
    }

    // Getters e Setters
    public UserFavoriteMoviesId getId() {
        return id;
    }

    public void setId(UserFavoriteMoviesId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovies() {
        return movie;
    }

    public void setMovies(Movie movies) {
        this.movie = movies;
    }

    public Date getFavoritedAt() {
        return favoritedAt;
    }

    public void setFavoritedAt(Date favoritedAt) {
        this.favoritedAt = favoritedAt;
    }
}