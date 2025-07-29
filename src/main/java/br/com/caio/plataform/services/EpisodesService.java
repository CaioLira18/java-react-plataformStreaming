package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.caio.plataform.entities.Episodes;
import br.com.caio.plataform.repository.EpisodeRepository;


@Service
public class EpisodesService {
    private EpisodeRepository episodeRepository;

    @Autowired
    public EpisodesService(EpisodeRepository episodeRepository) {
        this.episodeRepository = episodeRepository;
    }

    public Episodes insert(@RequestBody Episodes episodes){
        return episodeRepository.save(episodes);
    }

    public Optional<Episodes> findById(String id){
        return episodeRepository.findById(id);
    }

    public List<Episodes> findAll(){
        return episodeRepository.findAll();
    }

    public Episodes update(String id, Episodes episode){
        Optional<Episodes> existingEpisodes = episodeRepository.findById(id);
        if(existingEpisodes.isPresent()){
            Episodes episodesToUpdate = existingEpisodes.get();
            episodesToUpdate.setName(episode.getName());
            episodesToUpdate.setDuration(episode.getDuration());
            episodesToUpdate.setImageEpisode(episode.getImageEpisode());
            episodesToUpdate.setEpisodeDescription(episode.getEpisodeDescription());

            return episodeRepository.save(episodesToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id){
        if(episodeRepository.existsById(id)){
            episodeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
