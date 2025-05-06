package com.example.backendcloudtwit.service;

import com.example.backendcloudtwit.model.Hilo;
import com.example.backendcloudtwit.repository.HiloRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class HiloService {
    private final HiloRepository hiloRepository;

    public HiloService(HiloRepository hiloRepository) {
        this.hiloRepository = hiloRepository;
    }

    public List<Hilo> getAllHilos() {
        return hiloRepository.findAll();
    }

    // CREATE
    public Hilo createHilo(Hilo hilo) {
        return hiloRepository.save(hilo);
    }

    // READ (by id)
    public Hilo getHiloById(String id) {
        return hiloRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Hilo no encontrado: " + id));
    }

    // UPDATE
    public Hilo updateHilo(String id, Hilo newData) {
        Hilo hilo = getHiloById(id);
        hilo.setText(newData.getText());
        hilo.setUser(newData.getUser());
        hilo.setPost(newData.getPost());
        hilo.setLikes(newData.getLikes());
        return hiloRepository.save(hilo);
    }

    // DELETE
    public void deleteHilo(String id) {
        hiloRepository.deleteById(id);
    }


    public Hilo likeHilo(String id) {
        Hilo hilo = hiloRepository.findById(id).orElseThrow();
        hilo.setLikes(hilo.getLikes() + 1);
        return hiloRepository.save(hilo);
    }
}

