package com.example.backendcloudtwit.service;

import com.example.backendcloudtwit.model.Hilo;
import com.example.backendcloudtwit.repository.HiloRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HiloService {
    private final HiloRepository hiloRepository;

    public HiloService(HiloRepository hiloRepository) {
        this.hiloRepository = hiloRepository;
    }

    public Hilo createHilo(Hilo hilo) {
        return hiloRepository.save(hilo);
    }
    //Cambiar String por el post Id
    public List<Hilo> getHilosByPostId(String postId) {
        return hiloRepository.findByPost(postId);
    }

    public void deleteHilo(String id) {
        hiloRepository.deleteById(id);
    }

    public Hilo likeHilo(String id) {
        Hilo hilo = hiloRepository.findById(id).orElseThrow();
        hilo.setLikes(hilo.getLikes() + 1);
        return hiloRepository.save(hilo);
    }
}

