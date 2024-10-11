package com.backend.db.table;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRep extends JpaRepository<Video, String> {
    Video findByVideoId(String videoId);
}
