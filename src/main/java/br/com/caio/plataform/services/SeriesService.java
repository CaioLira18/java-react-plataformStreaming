package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.caio.plataform.entities.Series;
import br.com.caio.plataform.repository.SeriesRepository;

@Service
public class SeriesService {

    private SeriesRepository seriesRepository;

    @Autowired
    public SeriesService(SeriesRepository seriesRepository) {
        this.seriesRepository = seriesRepository;
    }

    public Optional<Series> findById(String id){
        return seriesRepository.findById(id);
    }

    public List<Series> findAll(String id){
        return seriesRepository.findAll();
    }

    public Series update(String id, Series series){
        Optional<Series> existingSeries = seriesRepository.findById(id);
        if(existingSeries.isPresent()){
            Series seriesToUpdate = existingSeries.get();
            seriesToUpdate.setName(series.getName());
            seriesToUpdate.setCategory(series.getCategory());
            seriesToUpdate.setType(series.getType());
            seriesToUpdate.setImage(series.getImage());

            return seriesRepository.save(seriesToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id){
        if(seriesRepository.existsById(id)){
            seriesRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
