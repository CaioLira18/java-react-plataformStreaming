package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        System.out.println("Criando usuário: " + user.getName() + ", " + user.getEmail());
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public Optional<User> updateUser(String id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            // Log para debug
            System.out.println("=== Atualizando usuário ===");
            System.out.println("ID: " + id);
            System.out.println("Nome recebido: " + updatedUser.getName());
            System.out.println("Email recebido: " + updatedUser.getEmail());
            System.out.println("CPF recebido: " + updatedUser.getCpf());
            System.out.println("Photo recebido: " + (updatedUser.getPhoto() != null ? "Sim" : "Não"));
            System.out.println("Senha recebida: " + (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank() ? "Sim" : "Não"));
            
            // Atualiza campos obrigatórios
            if (updatedUser.getName() != null && !updatedUser.getName().trim().isEmpty()) {
                user.setName(updatedUser.getName());
            }
            
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().trim().isEmpty()) {
                user.setEmail(updatedUser.getEmail());
            }
            
            // Atualiza CPF apenas se fornecido
            if (updatedUser.getCpf() != null && !updatedUser.getCpf().trim().isEmpty()) {
                user.setCpf(updatedUser.getCpf());
            }
            
            // Atualiza foto apenas se fornecida
            if (updatedUser.getPhoto() != null && !updatedUser.getPhoto().trim().isEmpty()) {
                user.setPhoto(updatedUser.getPhoto());
            }

            // Atualiza role apenas se fornecida (admin pode alterar)
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }

            // Atualiza senha apenas se fornecida e não estiver vazia
            if (updatedUser.getPassword() != null && 
                !updatedUser.getPassword().trim().isEmpty() && 
                !updatedUser.getPassword().isBlank()) {
                String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
                user.setPassword(encodedPassword);
                System.out.println("Senha atualizada com sucesso");
            } else {
                System.out.println("Senha não foi alterada");
            }

            User savedUser = userRepository.save(user);
            System.out.println("Usuário salvo com sucesso: " + savedUser.getName());
            
            return savedUser;
        });
    }

    public boolean deleteUser(String id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            System.out.println("Usuário deletado: " + id);
            return true;
        }).orElse(false);
    }
}