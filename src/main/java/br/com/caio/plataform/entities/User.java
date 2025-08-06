package br.com.caio.plataform.entities;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import br.com.caio.plataform.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Entity
@Data
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String email;
    
    @Enumerated(EnumType.STRING) 
    @Column(nullable = false)
    private UserRole role;
    
    private String password;
    private String cpf;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<UserFavoriteMovie> favoriteMovies;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<UserFavoriteSeries> favoriteSeries;

}