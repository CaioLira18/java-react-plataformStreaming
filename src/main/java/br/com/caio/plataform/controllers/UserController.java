package br.com.caio.plataform.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.caio.plataform.dto.UserDTO;
import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.services.UserService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://java-react-plataform-streaming.vercel.app/",
        "https://java-react-plataformstreaming.onrender.com"
})
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        System.out.println("Dados recebidos: " + user.getName() + ", " + user.getEmail());
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateItem(@PathVariable String id, @RequestBody UserDTO userDto) {
        User userEntity = new User();
        userEntity.setName(userDto.getName());
        userEntity.setEmail(userDto.getEmail());
        userEntity.setCpf(userDto.getCpf());
        userEntity.setPhoto(userDto.getPhoto());
        userEntity.setPassword(userDto.getPassword());
        // Adicione a role se ela for obrigatória, ou garanta que o Service não a apague
        userEntity.setRole(userDto.getRole());

        Optional<User> updatedItem = userService.updateItem(id, userEntity);
        return updatedItem.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}
