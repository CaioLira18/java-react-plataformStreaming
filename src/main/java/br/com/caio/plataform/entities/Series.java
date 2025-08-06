package br.com.caio.plataform.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import br.com.caio.plataform.entities.enums.ContentCategory;
import br.com.caio.plataform.entities.enums.ContentType;
import jakarta.persistence.*;

@Entity
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
    
    // Relacionamento com usuários que favoritaram esta série (via tabela intermediária)
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserFavoriteSeries> usersWhoFavorited;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public ContentCategory getCategory() {
        return category;
    }

    public void setCategory(ContentCategory category) {
        this.category = category;
    }

    public ContentType getType() {
        return type;
    }

    public void setType(ContentType type) {
        this.type = type;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getImageVertical() {
        return imageVertical;
    }

    public void setImageVertical(String imageVertical) {
        this.imageVertical = imageVertical;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getImage1() {
        return image1;
    }

    public void setImage1(String image1) {
        this.image1 = image1;
    }

    public String getImage2() {
        return image2;
    }

    public void setImage2(String image2) {
        this.image2 = image2;
    }

    public String getImage3() {
        return image3;
    }

    public void setImage3(String image3) {
        this.image3 = image3;
    }

    public List<Seassons> getSeassonsList() {
        return seassonsList;
    }

    public void setSeassonsList(List<Seassons> seassonsList) {
        this.seassonsList = seassonsList;
    }

    public List<UserFavoriteSeries> getUsersWhoFavorited() {
        return usersWhoFavorited;
    }

    public void setUsersWhoFavorited(List<UserFavoriteSeries> usersWhoFavorited) {
        this.usersWhoFavorited = usersWhoFavorited;
    }
}
