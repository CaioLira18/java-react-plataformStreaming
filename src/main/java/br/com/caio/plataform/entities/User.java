package br.com.caio.plataform.entities;

import java.util.Date;
import java.util.List;

import br.com.caio.plataform.entities.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="tb_users")
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

    @OneToMany
    List<Movie> favoriteMovies;

    @OneToMany
    List<Series> favoriteSeries;

    // Campo temporário para validação de admin, não vai para o banco
    @Transient
    private String adminPassword;
}
