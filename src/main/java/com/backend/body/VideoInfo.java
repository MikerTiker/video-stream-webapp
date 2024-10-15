package com.backend.body;

public class VideoInfo {
    private String title, description;
    private byte[] thumbnail;

    public String getTitle() {
        return title;
    }
    public String getDescription() {
        return description;
    }
    public byte[] getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }
}
