package br.com.caio.plataform.entities;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import br.com.caio.plataform.entities.enums.UserRole;
import jakarta.persistence.*;

@Entity
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String email;
    
    @Enumerated(EnumType.STRING) // 👈 importante!
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

    public User() {}

    public User(String name, String email, UserRole role, String password, String cpf) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
        this.cpf = cpf;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public List<UserFavoriteMovie> getFavoriteMovies() {
        return favoriteMovies;
    }

    public void setFavoriteMovies(List<UserFavoriteMovie> favoriteMovies) {
        this.favoriteMovies = favoriteMovies;
    }

    public List<UserFavoriteSeries> getFavoriteSeries() {
        return favoriteSeries;
    }

    public void setFavoriteSeries(List<UserFavoriteSeries> favoriteSeries) {
        this.favoriteSeries = favoriteSeries;
    }
}