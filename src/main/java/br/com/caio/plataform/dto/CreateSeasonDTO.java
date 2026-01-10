package br.com.caio.plataform.dto;

import lombok.Getter;
import lombok.Setter;

public class CreateSeasonDTO {
    private String name;
    private String seriesId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeriesId() {
        return seriesId;
    }

    public void setSeriesId(String seriesId) {
        this.seriesId = seriesId;
    }


}