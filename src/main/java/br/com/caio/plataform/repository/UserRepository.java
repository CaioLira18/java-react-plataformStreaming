package br.com.caio.plataform.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caio.plataform.entities.User;

public interface UserRepository extends JpaRepository<User, String> {

}
