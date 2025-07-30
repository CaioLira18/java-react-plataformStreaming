package br.com.caio.plataform.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEpisodeDTO {
    private String name;
    private String episodeDescription;
    private String imageEpisode;
    private String duration;
    private String year;
    private String seasonId;
}