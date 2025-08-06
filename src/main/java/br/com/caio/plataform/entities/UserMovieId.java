package br.com.caio.plataform.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class UserMovieId implements Serializable {

    private String userId;
    private String movieId;



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