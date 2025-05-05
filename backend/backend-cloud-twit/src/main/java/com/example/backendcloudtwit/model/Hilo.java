package com.example.backendcloudtwit.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hilos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hilo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    // Usuario que comenta
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User usuario;

    // Post al que pertenece el hilo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // Número de likes
    @Column(nullable = false)
    private Integer likes = 0;
}

