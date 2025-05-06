package com.example.backendcloudtwit.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "hilos")
public class Hilo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String text;

    private String user; // ID de usuario

    private String post; // ID del post

    private int likes;
}
