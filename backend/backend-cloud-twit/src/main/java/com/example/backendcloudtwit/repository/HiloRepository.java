package com.example.backendcloudtwit.repository;

import com.example.backendcloudtwit.model.Hilo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiloRepository extends JpaRepository<Hilo, Long> {
    List<Hilo> findByPostId(Long postId);
}