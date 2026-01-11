package br.com.caio.plataform.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.caio.plataform.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;

    private String photo;
    
    @Enumerated(EnumType.STRING) 
    @Column(name = "role", nullable = false, length = 50)
    private UserRole role;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String cpf;

    @ManyToMany
    @JoinTable(
        name = "user_favorite_movies",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private List<Movie> favoriteMovieList = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "user_favorite_series",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "series_id")
    )
    private List<Series> favoriteSeriesList = new ArrayList<>();

    // Construtor padrão
    public User() {}

    // Construtor com parâmetros essenciais
    public User(String name, String email, UserRole role, String password) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    public void setFavoriteMovieList(List<Movie> favoriteMovieList) {
        this.favoriteMovieList = favoriteMovieList;
    }

    public List<Series> getFavoriteSeriesList() {
        return favoriteSeriesList;
    }

    public void setFavoriteSeriesList(List<Series> favoriteSeriesList) {
        this.favoriteSeriesList = favoriteSeriesList;
    }   
}