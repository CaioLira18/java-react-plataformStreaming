package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.caio.plataform.entities.Seassons;
import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.repository.SeassonsRepository;
import br.com.caio.plataform.repository.SeriesRepository;

@Service
public class SeassonsService {

    private final SeassonsRepository seassonsRepository;
    private final SeriesRepository seriesRepository;

    @Autowired
    public SeassonsService(SeassonsRepository seassonsRepository, SeriesRepository seriesRepository) {
        this.seassonsRepository = seassonsRepository;
        this.seriesRepository = seriesRepository;
    }

    public Seassons insert(Seassons seasson) {
        return seassonsRepository.save(seasson);
    }

    // Novo método para criar temporada vinculada a uma série
    public Seassons createSeasonBySeries(String seriesId, String seasonName) {
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);
        
        if (!seriesOptional.isPresent()) {
            throw new RuntimeException("Série não encontrada com ID: " + seriesId);
        }

        Series series = seriesOptional.get();
        
        Seassons newSeason = new Seassons();
        newSeason.setName(seasonName);
        newSeason.setSeries(series);
        
        return seassonsRepository.save(newSeason);
    }

    // Método para buscar temporadas por ID da série
    public List<Seassons> findBySeriesId(String seriesId) {
        return seassonsRepository.findBySeriesId(seriesId);
    }

    public Optional<Seassons> findById(String id) {
        return seassonsRepository.findById(id);
    }

    public List<Seassons> findAll() {
        return seassonsRepository.findAll();
    }

    public Seassons update(String id, Seassons seassons) {
        Optional<Seassons> existingSeassons = seassonsRepository.findById(id);
        if (existingSeassons.isPresent()) {
            Seassons seassonsToUpdate = existingSeassons.get();
            seassonsToUpdate.setName(seassons.getName());
            return seassonsRepository.save(seassonsToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id) {
        if (seassonsRepository.existsById(id)) {
            seassonsRepository.deleteById(id);
            return true;
        }
        return false;
    }
}