package com.backend.db.table;

import jakarta.persistence.*;

@Entity
public class Video {
    @Id
    @Column(unique = true, nullable = false)
    private String videoId;
    @Column(nullable = false)
    private String title;
    private String description;
    @Lob
    @Column(nullable = false, columnDefinition = "MEDIUMBLOB")
    private byte[] thumbnail;

    public String getVideoId() {
        return videoId;
    }
    public String getTitle() {
        return title;
    }
    public String getDescription() {
        return description;
    }
    public byte[] getThumbnail() {
        return thumbnail;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }
}