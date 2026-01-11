package br.com.caio.plataform.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.caio.plataform.entities.Episodes;
import br.com.caio.plataform.dto.CreateEpisodeDTO;
import br.com.caio.plataform.services.EpisodesService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://java-react-plataformstreaming.onrender.com"
})
@RequestMapping("/api/episodes")
public class EpisodeController {
    
    private final EpisodesService episodesService;

    @Autowired
    public EpisodeController(EpisodesService episodesService) {
        this.episodesService = episodesService;
    }

    // Método original mantido
    @PostMapping
    public ResponseEntity<Episodes> createEpisode(@RequestBody Episodes episode) {
        Episodes createdEpisode = episodesService.insert(episode);
        return new ResponseEntity<>(createdEpisode, HttpStatus.CREATED);
    }

    // Novo método para criar episódio por ID da temporada
    @PostMapping("/season/{seasonId}")
    public ResponseEntity<Episodes> createEpisodeBySeason(
            @PathVariable String seasonId, 
            @RequestBody CreateEpisodeDTO episodeDTO) {
        try {
            Episodes createdEpisode = episodesService.createEpisodeBySeason(seasonId, episodeDTO);
            return new ResponseEntity<>(createdEpisode, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Método para buscar episódios de uma temporada específica
    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<Episodes>> getEpisodesBySeason(@PathVariable String seasonId) {
        List<Episodes> episodes = episodesService.findBySeasonId(seasonId);
        return new ResponseEntity<>(episodes, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Episodes>> getAllEpisodes() {
        List<Episodes> episodes = episodesService.findAll();
        return new ResponseEntity<>(episodes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Episodes> getEpisodeById(@PathVariable String id) {
        Optional<Episodes> episodes = episodesService.findById(id);
        if (episodes.isPresent()) {
            return new ResponseEntity<>(episodes.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Episodes> updateEpisode(@PathVariable String id, @RequestBody Episodes episodes) {
        Episodes updatedEpisode = episodesService.update(id, episodes);
        if (updatedEpisode != null) {
            return new ResponseEntity<>(updatedEpisode, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpisode(@PathVariable String id) {
        boolean deleted = episodesService.deleteById(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}