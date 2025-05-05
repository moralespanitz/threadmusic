package com.example.backendcloudtwit.model;

import jakarta.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookmarks")
public class Bookmark {
    @Id
    private String id;

    private String user; // ID de usuario

    private String post; // ID del post

    // Getters y setters
    public Bookmark() {}

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
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
}

