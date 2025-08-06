package br.com.caio.plataform.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import br.com.caio.plataform.entities.enums.ContentCategory;
import br.com.caio.plataform.entities.enums.ContentType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tb_series")
public class Series {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String image;
    private ContentCategory category;
    private ContentType type;
    private String marca;
    private String imageVertical;
    private String age;

    private String image1;
    private String image2;
    private String image3;

    // Relacionamento com temporadas
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("series-seasons")
    private List<Seassons> seassonsList;
    
    // Relacionamento com usuários que favoritaram esta série
    @ManyToMany(mappedBy = "favoriteSeries")
    @JsonBackReference("user-series")
    private List<User> users;

    public String getId(){
        return id;
    }
}