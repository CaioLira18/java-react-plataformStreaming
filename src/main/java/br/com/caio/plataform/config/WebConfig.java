package br.com.caio.plataform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // especifique, não use "*"
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true); // se não usar cookies, pode remover
    }
}
