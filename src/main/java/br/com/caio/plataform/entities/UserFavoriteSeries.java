package br.com.caio.plataform.entities;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class UserFavoriteSeries implements Serializable {

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

    public UserFavoriteSeries() {}

    public UserFavoriteSeries(User user, Series series) {
        this.user = user;
        this.series = series;
        this.id = new UserSeriesId(user.getId(), series.getId());
    }

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