package br.com.caio.plataform.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class UserSeriesId implements Serializable {

    private String userId;
    private String seriesId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserSeriesId)) return false;
        UserSeriesId that = (UserSeriesId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(seriesId, that.seriesId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, seriesId);
    }
}