package br.com.caio.plataform.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CollectionFranquia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String franquia;
    private String backgroundFranquia;
    private String descricaoFranquia;
    private String logoFranquia;

    // Construtor padrão
    public CollectionFranquia() {
    }

    // Construtor com parâmetros
    public CollectionFranquia(String franquia, String backgroundFranquia, String descricaoFranquia, String logoFranquia) {
        this.franquia = franquia;
        this.backgroundFranquia = backgroundFranquia;
        this.descricaoFranquia = descricaoFranquia;
        this.logoFranquia = logoFranquia;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFranquia() {
        return franquia;
    }

    public void setFranquia(String franquia) {
        this.franquia = franquia;
    }

    public String getBackgroundFranquia() {
        return backgroundFranquia;
    }

    public void setBackgroundFranquia(String backgroundFranquia) {
        this.backgroundFranquia = backgroundFranquia;
    }

    public String getDescricaoFranquia() {
        return descricaoFranquia;
    }

    public void setDescricaoFranquia(String descricaoFranquia) {
        this.descricaoFranquia = descricaoFranquia;
    }

    public String getLogoFranquia() {
        return logoFranquia;
    }

    public void setLogoFranquia(String logoFranquia) {
        this.logoFranquia = logoFranquia;
    }
}