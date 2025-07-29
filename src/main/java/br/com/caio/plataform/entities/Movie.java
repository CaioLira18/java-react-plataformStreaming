package br.com.caio.plataform.entities;

import br.com.caio.plataform.entities.enums.ContentCategory;
import br.com.caio.plataform.entities.enums.ContentType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="tb_movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String image;
    private String movieDescription;
    private ContentCategory category;
    private ContentType type;

}
