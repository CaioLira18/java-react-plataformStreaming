package br.com.caio.plataform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@Table(name="tb_aulas")
public class Episodes {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String episodeDescription;
    private String imageEpisode;
    private String duration;
    
    // Adicionar referência à temporada
    @ManyToOne
    @JoinColumn(name = "season_id")
    @JsonIgnore
    private Seassons season;
}