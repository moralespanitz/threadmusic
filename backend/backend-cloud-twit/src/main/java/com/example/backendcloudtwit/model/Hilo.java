package com.example.backendcloudtwit.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;



@Getter
@Setter
@Document(collection = "hilos")
public class Hilo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    private String text;

    private String user; // ID de usuario

    private String post; // ID del post

    private int likes;
}
