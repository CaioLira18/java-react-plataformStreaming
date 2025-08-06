package br.com.caio.plataform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
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
}