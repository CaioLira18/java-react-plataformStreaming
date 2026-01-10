package br.com.caio.plataform.dto;

import lombok.Getter;
import lombok.Setter;

public class CreateEpisodeDTO {
    private String name;
    private String episodeDescription;
    private String imageEpisode;
    private String duration;
    private String year;
    private String seasonId;

    public String getName() {
        return name;
    }

    public String getEpisodeDescription() {
        return episodeDescription;
    }

    public String getImageEpisode() {
        return imageEpisode;
    }

    public String getDuration() {
        return duration;
    }

    public String getYear() {
        return year;
    }

    public String getSeasonId() {
        return seasonId;
    }


}