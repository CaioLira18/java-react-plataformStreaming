package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.caio.plataform.entities.CollectionFranquia;
import br.com.caio.plataform.repository.CollectionFranquiaRepository;

@Service
public class CollectionFranquiaService {
     private CollectionFranquiaRepository collectionFranquiaRepository;

    @Autowired
    public CollectionFranquiaService(CollectionFranquiaRepository collectionFranquiaRepository) {
        this.collectionFranquiaRepository = collectionFranquiaRepository;
    }

    public CollectionFranquia insert(@RequestBody CollectionFranquia collectionFranquia) {
        return collectionFranquiaRepository.save(collectionFranquia);
    }

    public Optional<CollectionFranquia> findById(String id){
        return collectionFranquiaRepository.findById(id);
    }

    public List<CollectionFranquia> findAll(){
        return collectionFranquiaRepository.findAll();
    }

    public CollectionFranquia update(String id, CollectionFranquia collectionFranquia){
        Optional<CollectionFranquia> existingCollectionFranquia = collectionFranquiaRepository.findById(id);
        if(existingCollectionFranquia.isPresent()){
            CollectionFranquia collectionToUpdate = existingCollectionFranquia.get();
            collectionToUpdate.setFranquia(collectionFranquia.getFranquia());
            collectionToUpdate.setBackgroundFranquia(collectionFranquia.getBackgroundFranquia());
            collectionToUpdate.setDescricaoFranquia(collectionFranquia.getDescricaoFranquia());
            collectionToUpdate.setLogoFranquia(collectionFranquia.getLogoFranquia());

            return collectionFranquiaRepository.save(collectionToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id){
        if(collectionFranquiaRepository.existsById(id)){
            collectionFranquiaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
