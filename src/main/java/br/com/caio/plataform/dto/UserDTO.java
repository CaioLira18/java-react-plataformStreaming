package br.com.caio.plataform.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import br.com.caio.plataform.entities.Movie;
import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.entities.enums.UserRole;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private String id;
    private String name;
    private String email;
    private String photo;
    private UserRole role;
    private String password;
    private String cpf;
    private List<Movie> favoriteMovieList;
    private List<Series> favoriteSeriesList;
}
