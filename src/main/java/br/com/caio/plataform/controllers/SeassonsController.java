package br.com.caio.plataform.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.caio.plataform.entities.Seassons;
import br.com.caio.plataform.services.SeassonsService;


@RestController
@CrossOrigin(origins = "http://localhost:5173") // Your Vite dev server
@RequestMapping("/api/seassons")
public class SeassonsController {
    private final SeassonsService seassonsService;

    @Autowired
    public SeassonsController(SeassonsService seassonsService) {
        this.seassonsService = seassonsService;
    }


    @PostMapping
    public ResponseEntity<Seassons> createEpisode(@RequestBody Seassons seasson) {
        Seassons createdSeasson = seassonsService.insert(seasson);
        return new ResponseEntity<>(createdSeasson, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Seassons>> getAllEpisodes() {
        List<Seassons> seassons = seassonsService.findAll();
        return new ResponseEntity<>(seassons, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seassons> getEpisodeById(@PathVariable String id) {
        Optional<Seassons> seassons = seassonsService.findById(id);
        if (seassons.isPresent()) {
            return new ResponseEntity<>(seassons.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seassons> updateEpisode(@PathVariable String id, @RequestBody Seassons seassons) {
        Seassons updatedSeassons = seassonsService.update(id, seassons);
        if (updatedSeassons != null) {
            return new ResponseEntity<>(updatedSeassons, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpisode(@PathVariable String id) {
        boolean deleted = seassonsService.deleteById(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
