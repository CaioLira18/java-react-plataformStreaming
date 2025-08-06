package br.com.caio.plataform.dto;

import br.com.caio.plataform.entities.enums.UserRole;

public class UserRegisterDTO {
    private String name;
    private String email;
    private String cpf;
    private String password;
    private UserRole role;

    // Construtor padrão
    public UserRegisterDTO() {}

    // Construtor com parâmetros
    public UserRegisterDTO(String name, String email, String cpf, String password, UserRole role, String profileImage) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
        this.role = role;
    }

    // Getters e Setters
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

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}