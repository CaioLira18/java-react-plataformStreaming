package br.com.caio.plataform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.caio.plataform.entities.Seassons;
import br.com.caio.plataform.repository.SeassonsRepository;

@Service
public class SeassonsService {

    private SeassonsRepository seassonsRepository;

    @Autowired
    public SeassonsService(SeassonsRepository seassonsRepository) {
        this.seassonsRepository = seassonsRepository;
    }

    public Seassons insert(@RequestBody Seassons seasson) {
        return seassonsRepository.save(seasson);
    }

    public Optional<Seassons> findById(String id){
        return seassonsRepository.findById(id);
    }

    public List<Seassons> findAll(){
        return seassonsRepository.findAll();
    }

    public Seassons update(String id, Seassons seassons){
        Optional<Seassons> existingSeassons = seassonsRepository.findById(id);
        if(existingSeassons.isPresent()){
            Seassons seassonsToUpdate = existingSeassons.get();
            seassonsToUpdate.setName(seassons.getName());

            return seassonsRepository.save(seassonsToUpdate);
        }
        return null;
    }

    public boolean deleteById(String id){
        if(seassonsRepository.existsById(id)){
            seassonsRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
