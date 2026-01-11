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

    public Optional<User> updateItem(String id, User updatedItem) {
        return userRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setEmail(updatedItem.getEmail());
            item.setCpf(updatedItem.getCpf());
            item.setPhoto(updatedItem.getPhoto());
            item.setRole(updatedItem.getRole());

            // Atualização das listas ManyToMany
            if (updatedItem.getFavoriteMovieList() != null) {
                item.getFavoriteMovieList().clear();
                item.getFavoriteMovieList().addAll(updatedItem.getFavoriteMovieList());
            }

            if (updatedItem.getFavoriteSeriesList() != null) {
                item.getFavoriteSeriesList().clear();
                item.getFavoriteSeriesList().addAll(updatedItem.getFavoriteSeriesList());
            }

            // Atualização de senha
            if (updatedItem.getPassword() != null && !updatedItem.getPassword().isEmpty()
                    && !passwordEncoder.matches(updatedItem.getPassword(), item.getPassword())) {
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