package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.plataform.entities.Episodes;
import br.com.caio.plataform.entities.Seassons;
import br.com.caio.plataform.dto.CreateEpisodeDTO;
import br.com.caio.plataform.repository.EpisodeRepository;
import br.com.caio.plataform.repository.SeassonsRepository;

@Service
public class EpisodesService {
    
    private final EpisodeRepository episodeRepository;
    private final SeassonsRepository seassonsRepository;

    @Autowired
    public EpisodesService(EpisodeRepository episodeRepository, SeassonsRepository seassonsRepository) {
        this.episodeRepository = episodeRepository;
        this.seassonsRepository = seassonsRepository;
    }

    public Episodes insert(Episodes episodes) {
        return episodeRepository.save(episodes);
    }

    // Novo método para criar episódio vinculado a uma temporada
    public Episodes createEpisodeBySeason(String seasonId, CreateEpisodeDTO episodeDTO) {
        Optional<Seassons> seasonOptional = seassonsRepository.findById(seasonId);
        
        if (!seasonOptional.isPresent()) {
            throw new RuntimeException("Temporada não encontrada com ID: " + seasonId);
        }

        Seassons season = seasonOptional.get();
        
        Episodes newEpisode = new Episodes();
        newEpisode.setName(episodeDTO.getName());
        newEpisode.setEpisodeDescription(episodeDTO.getEpisodeDescription());
        newEpisode.setImageEpisode(episodeDTO.getImageEpisode());
        newEpisode.setDuration(episodeDTO.getDuration());
        newEpisode.setSeason(season);
        
        return episodeRepository.save(newEpisode);
    }

    // Método para buscar episódios por ID da temporada
    public List<Episodes> findBySeasonId(String seasonId) {
        return episodeRepository.findBySeasonId(seasonId);
    }

    public Optional<Episodes> findById(String id) {
        return episodeRepository.findById(id);
    }

    public List<Episodes> findAll() {
        return episodeRepository.findAll();
    }

    public Episodes update(String id, Episodes episode) {
        Optional<Episodes> existingEpisodes = episodeRepository.findById(id);
        if (existingEpisodes.isPresent()) {
            Episodes episodesToUpdate = existingEpisodes.get();
            episodesToUpdate.setName(episode.getName());
            episodesToUpdate.setDuration(episode.getDuration());
            episodesToUpdate.setImageEpisode(episode.getImageEpisode());
            episodesToUpdate.setEpisodeDescription(episode.getEpisodeDescription());

            return episodeRepository.save(episodesToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id) {
        if (episodeRepository.existsById(id)) {
            episodeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}