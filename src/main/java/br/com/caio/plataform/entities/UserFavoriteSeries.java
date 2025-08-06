package br.com.caio.plataform.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "user_favorite_series")
public class UserFavoriteSeries {

    @EmbeddedId
    private UserSeriesId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("seriesId")
    @JoinColumn(name = "series_id")
    private Series series;

    // Getters e Setters
    public UserSeriesId getId() {
        return id;
    }

    public void setId(UserSeriesId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Series getSeries() {
        return series;
    }

    public void setSeries(Series series) {
        this.series = series;
    }
}
