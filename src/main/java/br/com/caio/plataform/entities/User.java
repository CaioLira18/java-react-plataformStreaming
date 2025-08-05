package br.com.caio.plataform.entities;

import java.util.Date;
import java.util.List;

import br.com.caio.plataform.entities.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
    
    private String name;
    private String email;
    private UserRole role;
    private String password;
    private String cpf;
    private Date birthDate;
    private String profileImage;
    
    @ManyToMany
    @JoinTable(
        name = "user_favorite_movies",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private List<Movie> favoriteMovieList;
    
    // ALTERADO: Agora salva Series em vez de Seassons
    @ManyToMany
    @JoinTable(
        name = "user_favorite_series",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "serie_id") // Mudança aqui
    )
    private List<Series> favoriteSerieList; // Nome mais claro
    
    @Transient
    private String adminPassword;
}