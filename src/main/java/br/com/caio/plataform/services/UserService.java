package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.caio.plataform.dto.CreateUserDTO;
import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.entities.enums.UserRole;
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

    public User createUser(CreateUserDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setCpf(dto.getCpf());
        user.setPhoto(dto.getPhoto());
        user.setRole(dto.getRole() != null ? dto.getRole() : UserRole.USER);

        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    public Optional<User> updateItem(String id, User updatedItem) {
        return userRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setEmail(updatedItem.getEmail());
            item.setCpf(updatedItem.getCpf());
            item.setPhoto(updatedItem.getPhoto());

            if (updatedItem.getPassword() != null && !updatedItem.getPassword().isEmpty()
                    && !updatedItem.getPassword().startsWith("$2a$")) {
                item.setPassword(passwordEncoder.encode(updatedItem.getPassword()));
            }

            return userRepository.save(item);
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