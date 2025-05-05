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

    public List<Hilo> getHilosByPostId(Long postId) {
        return hiloRepository.findByPostId(postId);
    }

    public void deleteHilo(Long id) {
        hiloRepository.deleteById(id);
    }

    public Hilo likeHilo(Long id) {
        Hilo hilo = hiloRepository.findById(id).orElseThrow();
        hilo.setLikes(hilo.getLikes() + 1);
        return hiloRepository.save(hilo);
    }
}

