package br.com.caio.plataform.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.caio.plataform.entities.enums.ContentCategory;
import br.com.caio.plataform.entities.enums.ContentType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
    private String image;
    private ContentCategory category;
    private ContentType type;

    @OneToMany
    @JsonIgnore
    private List<Episodes> episodesList;

}
