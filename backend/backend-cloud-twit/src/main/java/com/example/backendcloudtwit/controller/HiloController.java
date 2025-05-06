package com.example.backendcloudtwit.controller;

import com.example.backendcloudtwit.model.Hilo;
import com.example.backendcloudtwit.service.HiloService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Hilos", description = "CRUD de hilos y operaciones relacionadas")
@RestController
@RequestMapping("/api/hilos")
public class HiloController {
    private final HiloService hiloService;

    public HiloController(HiloService hiloService) {
        this.hiloService = hiloService;
    }

    @Operation(summary = "Crear un nuevo hilo")
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Hilo> createHilo(@RequestBody Hilo hilo) {
        Hilo creado = hiloService.createHilo(hilo);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /** GET ALL */
    @Operation(summary = "Obtener todos los hilos")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Hilo>> getAllHilos() {
        List<Hilo> lista = hiloService.getAllHilos();
        return ResponseEntity.ok(lista);
    }

    @Operation(summary = "Obtener un hilo por ID")
    @GetMapping(
            value = "/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Hilo> getHiloById(@PathVariable String id) {
        Hilo hilo = hiloService.getHiloById(id);
        return ResponseEntity.ok(hilo);
    }

    @Operation(summary = "Actualizar un hilo existente")
    @PutMapping(value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Hilo> updateHilo(
            @PathVariable String id,
            @RequestBody Hilo hiloActualizado) {
        Hilo updated = hiloService.updateHilo(id, hiloActualizado);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar un hilo por ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHilo(@PathVariable String id) {
        hiloService.deleteHilo(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Darle like a un hilo")
    @PostMapping("/{id}/like")
    public ResponseEntity<Hilo> like(@PathVariable String id) {
        return ResponseEntity.ok(hiloService.likeHilo(id));
    }
}

