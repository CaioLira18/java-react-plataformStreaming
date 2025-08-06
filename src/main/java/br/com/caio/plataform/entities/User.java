package br.com.caio.plataform.entities;

import java.util.Date;
import java.util.List;

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
    private UserRole role;
    private String password;
    private String cpf;
    private Date birthDate;
    private String profileImage;

    // Campo temporário para validação de admin (não persiste no banco)
    @Transient
    private String adminPassword;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserFavoriteMovie> favoriteMovies;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserFavoriteSeries> favoriteSeries;

    // Constructors
    public User() {}

    public User(String id, String name, String email, UserRole role, String password, String cpf, 
                Date birthDate, String profileImage, String adminPassword, 
                List<UserFavoriteMovie> favoriteMovies, List<UserFavoriteSeries> favoriteSeries) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
        this.cpf = cpf;
        this.birthDate = birthDate;
        this.profileImage = profileImage;
        this.adminPassword = adminPassword;
        this.favoriteMovies = favoriteMovies;
        this.favoriteSeries = favoriteSeries;
    }

    // Getters and Setters
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

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
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