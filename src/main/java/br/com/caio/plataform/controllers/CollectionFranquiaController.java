package br.com.caio.plataform.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.caio.plataform.entities.CollectionFranquia;
import br.com.caio.plataform.services.CollectionFranquiaService;

@RestController
@RequestMapping("/api/collections")
public class CollectionFranquiaController {
    @Autowired
    private CollectionFranquiaService collectionFranquiaService;

    @GetMapping
    public ResponseEntity<List<CollectionFranquia>> getAllCollections() {
        return ResponseEntity.ok(collectionFranquiaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionFranquia> getCollectionById(@PathVariable String id) {
        Optional<CollectionFranquia> collectionFranquia = collectionFranquiaService.findById(id);
        return collectionFranquia.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CollectionFranquia> createCollection(@RequestBody CollectionFranquia collectionFranquia) {
        return ResponseEntity.ok(collectionFranquiaService.insert(collectionFranquia));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CollectionFranquia> updateFranquia(@PathVariable String id, @RequestBody CollectionFranquia collectionFranquia) {
        Optional<CollectionFranquia> updatedFranquias = collectionFranquiaService.update(id, collectionFranquia);
        return updatedFranquias.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        boolean deleted = collectionFranquiaService.deleteById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
