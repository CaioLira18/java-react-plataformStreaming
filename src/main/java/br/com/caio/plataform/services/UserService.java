package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User insert(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Criptografa a senha
        return userRepository.save(user);
    }

    public Optional<User> findById(String id){
        return userRepository.findById(id);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public User update(String id, User user){
        Optional<User> existingUser = userRepository.findById(id);
        if(existingUser.isPresent()){
            User userToUpdate = existingUser.get();
            userToUpdate.setName(user.getName());
            userToUpdate.setCpf(user.getCpf());
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setBirthDate(user.getBirthDate());

            // Atualiza a senha se fornecida
            if (user.getPassword() != null && !user.getPassword().isBlank()) {
                userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            return userRepository.save(userToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id){
        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
