package com.example.backendcloudtwit.controller;

import com.example.backendcloudtwit.model.Hilo;
import com.example.backendcloudtwit.service.HiloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hilos")
public class HiloController {
    private final HiloService hiloService;

    public HiloController(HiloService hiloService) {
        this.hiloService = hiloService;
    }

    @PostMapping
    public ResponseEntity<Hilo> create(@RequestBody Hilo hilo) {
        return ResponseEntity.ok(hiloService.createHilo(hilo));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Hilo>> getByPost(@PathVariable String postId) {
        return ResponseEntity.ok(hiloService.getHilosByPostId(postId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        hiloService.deleteHilo(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Hilo> like(@PathVariable String id) {
        return ResponseEntity.ok(hiloService.likeHilo(id));
    }
}

