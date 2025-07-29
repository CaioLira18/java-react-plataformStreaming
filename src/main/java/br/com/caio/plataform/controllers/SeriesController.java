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

import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.services.SeriesService;

@RestController
@CrossOrigin(origins = "http://localhost:5173") 
@RequestMapping("/api/series")
public class SeriesController {
    private final SeriesService seriesService;

    @Autowired
    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @PostMapping
    public ResponseEntity<Series> createSerie(@RequestBody Series serie) {
        Series createdSerie = seriesService.insert(serie);
        return new ResponseEntity<>(createdSerie, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Series>> getAllSeries() {
        List<Series> series = seriesService.findAll();
        return new ResponseEntity<>(series, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Series> getSerieById(@PathVariable String id) {
        Optional<Series> series = seriesService.findById(id);
        if (series.isPresent()) {
            return new ResponseEntity<>(series.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Series> updateSerie(@PathVariable String id, @RequestBody Series series) {
        Series updatedSeries = seriesService.update(id, series);
        if (updatedSeries != null) {
            return new ResponseEntity<>(updatedSeries, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpisode(@PathVariable String id) {
        boolean deleted = seriesService.deleteById(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
