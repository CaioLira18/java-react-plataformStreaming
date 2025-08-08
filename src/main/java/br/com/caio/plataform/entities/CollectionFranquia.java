package br.com.caio.plataform.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CollectionFranquia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String franquia;
    private String backgroundFranquia;
    private String descricaoFranquia;
    private String logoFranquia;
}
