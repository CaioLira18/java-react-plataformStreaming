package br.com.caio.plataform.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="tb_episodes")
public class Episodes {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String episodeDescription;
    private String imageEpisode;
    private String duration;
    private String year;
    // Adicionar referência à temporada
    @ManyToOne
    @JoinColumn(name = "season_id")
    @JsonIgnore
    private Seassons season;
}