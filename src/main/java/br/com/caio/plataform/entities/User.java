package br.com.caio.plataform.entities;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import br.com.caio.plataform.entities.enums.UserRole;
import jakarta.persistence.*;

@Entity
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING) 
    @Column(name = "role", nullable = false, length = 50)
    private UserRole role;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String cpf;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore 
    private List<UserFavoriteMovie> favoriteMovies;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore 
    private List<UserFavoriteSeries> favoriteSeries;

    // Construtor padrão
    public User() {}

    // Construtor com parâmetros essenciais
    public User(String name, String email, UserRole role, String password) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }

    public String getPassword() {
        return password;
    }

    public String getCpf() {
        return cpf;
    }

    public List<UserFavoriteMovie> getFavoriteMovies() {
        return favoriteMovies;
    }

    public List<UserFavoriteSeries> getFavoriteSeries() {
        return favoriteSeries;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void setFavoriteMovies(List<UserFavoriteMovie> favoriteMovies) {
        this.favoriteMovies = favoriteMovies;
    }

    public void setFavoriteSeries(List<UserFavoriteSeries> favoriteSeries) {
        this.favoriteSeries = favoriteSeries;
    }

    // Método utilitário para verificar se é admin
    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }
}