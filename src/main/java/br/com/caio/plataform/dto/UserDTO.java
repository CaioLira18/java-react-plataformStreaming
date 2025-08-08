package br.com.caio.plataform.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import br.com.caio.plataform.entities.Movie;
import br.com.caio.plataform.entities.Series;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private String id;
    private String name;
    private List<Movie> favoriteMovieList;
    private List<Series> favoriteSeriesList;
}
