package br.com.caio.plataform.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class UserSeriesId implements Serializable {

    private String userId;
    private String seriesId;

    // Constructors
    public UserSeriesId() {}

    public UserSeriesId(String userId, String seriesId) {
        this.userId = userId;
        this.seriesId = seriesId;
    }

    // Getters and Setters
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