package com.example.backendcloudtwit.controller;

import com.example.backendcloudtwit.model.Hilo;
import com.example.backendcloudtwit.service.HiloService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Hilo> createHilo(@RequestBody Hilo hilo) {
        Hilo creado = hiloService.createHilo(hilo);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /** GET ALL */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Hilo>> getAllHilos() {
        List<Hilo> lista = hiloService.getAllHilos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping(
            value = "/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Hilo> getHiloById(@PathVariable String id) {
        Hilo hilo = hiloService.getHiloById(id);
        return ResponseEntity.ok(hilo);
    }
    
    @PutMapping()
    public ResponseEntity<Hilo> updateHilo(
            @PathVariable String id,
            @RequestBody Hilo hiloActualizado) {
        Hilo updated = hiloService.updateHilo(id, hiloActualizado);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHilo(@PathVariable String id) {
        hiloService.deleteHilo(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Hilo> like(@PathVariable String id) {
        return ResponseEntity.ok(hiloService.likeHilo(id));
    }
}

