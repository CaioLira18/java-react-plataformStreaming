package br.com.caio.plataform.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class UserMovieId implements Serializable {

    private String userId;
    private String movieId;

    // Constructors
    public UserMovieId() {}

    public UserMovieId(String userId, String movieId) {
        this.userId = userId;
        this.movieId = movieId;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserMovieId)) return false;
        UserMovieId that = (UserMovieId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(movieId, that.movieId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, movieId);
    }
}