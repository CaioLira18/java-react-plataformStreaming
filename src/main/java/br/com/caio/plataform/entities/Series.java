package br.com.caio.plataform.entities;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import br.com.caio.plataform.entities.enums.ContentCategory;
import br.com.caio.plataform.entities.enums.ContentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="tb_series")
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

    private String image1;
    private String image2;
    private String image3;

    // Modificar para mapeamento bidirecional
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Seassons> seassonsList;
}