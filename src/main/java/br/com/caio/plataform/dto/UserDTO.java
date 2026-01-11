package br.com.caio.plataform.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import br.com.caio.plataform.entities.Movie;
import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
