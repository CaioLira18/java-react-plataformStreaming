package br.com.caio.plataform.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class UserFavoriteSeriesId implements Serializable {
    
    private String userId;
    private String seriesId;

    // Construtores
    public UserFavoriteSeriesId() {
    }

    public UserFavoriteSeriesId(String userId, String seriesId) {
        this.userId = userId;
        this.seriesId = seriesId;
    }

    // Getters e Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSeriesId() {
        return seriesId;
    }

    public void setSeriesId(String seriesId) {
        this.seriesId = seriesId;
    }

    // equals e hashCode (necessários para chaves compostas)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserFavoriteSeriesId that = (UserFavoriteSeriesId) o;
        return Objects.equals(userId, that.userId) && 
               Objects.equals(seriesId, that.seriesId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, seriesId);
    }
}