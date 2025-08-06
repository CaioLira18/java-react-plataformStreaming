package br.com.caio.plataform.entities;

import br.com.caio.plataform.entities.enums.ContentCategory;
import br.com.caio.plataform.entities.enums.ContentType;
import jakarta.persistence.Column;
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
    private String duration;
    private String year;
    private String imageVertical;
    
   
    @Column(columnDefinition = "TEXT")
    private String description;

    private ContentCategory category;
    private ContentType type;
    private String marca;
    private String age;

    private String image1;
    private String image2;
    private String image3;

    public String getId(){
        return id;
    }
}
