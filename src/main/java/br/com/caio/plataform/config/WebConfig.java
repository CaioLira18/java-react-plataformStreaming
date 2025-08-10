package br.com.caio.plataform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",                                    // Desenvolvimento local
                    "https://java-react-plataform-streaming.vercel.app",       // Frontend no Vercel
                    "https://*.vercel.app"                                      // Qualquer subdomínio do Vercel
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(false) // Mantém false para evitar problemas com Vercel
                .maxAge(3600); // Cache preflight por 1 hora
    }
}