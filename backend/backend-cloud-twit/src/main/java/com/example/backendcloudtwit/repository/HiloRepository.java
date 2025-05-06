package com.example.backendcloudtwit.repository;

import com.example.backendcloudtwit.model.Hilo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiloRepository extends MongoRepository<Hilo, String> {
    List<Hilo> findByPost(String postId);
}
