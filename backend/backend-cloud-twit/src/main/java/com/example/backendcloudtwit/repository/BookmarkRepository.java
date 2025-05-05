package com.example.backendcloudtwit.repository;

import com.example.backendcloudtwit.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends MongoRepository<Bookmark, String> {
    List<Bookmark> findByUser(String userId);
}
