package br.com.caio.plataform.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class UserFavoriteMoviesId implements Serializable {
    
    private String userId;
    private String moviesId;

    // Construtores
    public UserFavoriteMoviesId() {
    }

    public UserFavoriteMoviesId(String userId, String moviesId) {
        this.userId = userId;
        this.moviesId = moviesId;
    }

    // Getters e Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMoviesId() {
        return moviesId;
    }

    public void setMoviesId(String moviesId) {
        this.moviesId = moviesId;
    }

    // equals e hashCode (necessários para chaves compostas)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserFavoriteMoviesId that = (UserFavoriteMoviesId) o;
        return Objects.equals(userId, that.userId) && 
               Objects.equals(moviesId, that.moviesId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, moviesId);
    }
}