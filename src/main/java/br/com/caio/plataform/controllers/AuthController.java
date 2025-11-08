package br.com.caio.plataform.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.caio.plataform.entities.User;
import br.com.caio.plataform.repository.UserRepository;
import br.com.caio.plataform.services.LoginRequest;

@RestController
@CrossOrigin("http://java-react-plataform-streaming.vercel.app/")
@RequestMapping("/api/auth") // CORRIGIDO: mudou de "/auth" para "/api/auth"
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) LoginRequest loginRequest) {
        try {
            if (loginRequest == null || 
                loginRequest.getEmail() == null || 
                loginRequest.getPassword() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Email e senha são obrigatórios");
            }

            Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Usuário não encontrado");
            }

            User user = optionalUser.get();

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Senha inválida");
            }

            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getCpf(),
                    user.getRole()
            );

            return ResponseEntity.ok(response);

            } catch (Exception e) {
                // 🔍 Loga no servidor
                e.printStackTrace();
                // 🔒 Retorna mensagem amigável ao frontend
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erro interno ao processar login");
            }
        }
}