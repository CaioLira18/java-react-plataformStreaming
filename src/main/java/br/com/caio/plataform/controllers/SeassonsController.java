package br.com.caio.plataform.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.caio.plataform.entities.Seassons;
import br.com.caio.plataform.dto.CreateSeasonDTO;
import br.com.caio.plataform.services.SeassonsService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://java-react-plataformstreaming.onrender.com"
})
@RequestMapping("/api/seassons")
public class SeassonsController {
    
    private final SeassonsService seassonsService;

    @Autowired
    public SeassonsController(SeassonsService seassonsService) {
        this.seassonsService = seassonsService;
    }

    // Método original mantido
    @PostMapping
    public ResponseEntity<Seassons> createSeason(@RequestBody Seassons seasson) {
        Seassons createdSeasson = seassonsService.insert(seasson);
        return new ResponseEntity<>(createdSeasson, HttpStatus.CREATED);
    }

    // Novo método para criar temporada por ID da série
    @PostMapping("/series/{seriesId}")
    public ResponseEntity<Seassons> createSeasonBySeries(
            @PathVariable String seriesId,
            @RequestBody CreateSeasonDTO seasonDTO) {
        try {
            Seassons createdSeason = seassonsService.createSeasonBySeries(seriesId, seasonDTO.getName());
            return new ResponseEntity<>(createdSeason, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Método para buscar temporadas de uma série específica
    @GetMapping("/series/{seriesId}")
    public ResponseEntity<List<Seassons>> getSeasonsBySeries(@PathVariable String seriesId) {
        List<Seassons> seasons = seassonsService.findBySeriesId(seriesId);
        return new ResponseEntity<>(seasons, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Seassons>> getAllSeasons() {
        List<Seassons> seassons = seassonsService.findAll();
        return new ResponseEntity<>(seassons, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seassons> getSeasonById(@PathVariable String id) {
        Optional<Seassons> seassons = seassonsService.findById(id);
        if (seassons.isPresent()) {
            return new ResponseEntity<>(seassons.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seassons> updateSeason(@PathVariable String id, @RequestBody Seassons seassons) {
        Seassons updatedSeassons = seassonsService.update(id, seassons);
        if (updatedSeassons != null) {
            return new ResponseEntity<>(updatedSeassons, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeason(@PathVariable String id) {
        boolean deleted = seassonsService.deleteById(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
