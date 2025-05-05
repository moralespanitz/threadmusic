package com.example.backendcloudtwit.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hilos")
public class Hilo {
    @Id
    private String id;

    private String text;

    private String user; // ID de usuario

    private String post; // ID del post

    private int likes;

    // Constructor vacío (necesario para Spring Data MongoDB)
    public Hilo() {}

    // Getters y setters de todos los campos...
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }

    public String getUser() {
        return user;
    }
    public void setUser(String user) {
        this.user = user;
    }

    public String getPost() {
        return post;
    }
    public void setPost(String post) {
        this.post = post;
    }

    public int getLikes() {
        return likes;
    }
    public void setLikes(int likes) {
        this.likes = likes;
    }
}
