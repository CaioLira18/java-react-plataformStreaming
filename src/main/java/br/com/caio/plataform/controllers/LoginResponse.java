package br.com.caio.plataform.controllers;

import br.com.caio.plataform.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class LoginResponse {
    private String id;
    private String email;
    private String name;
    private String cpf;
    private UserRole role;
}
