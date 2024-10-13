package com.backend.body;

public class Directory {
    private final String id, directory;
    public Directory(String id, String directory) {
        this.id = id;
        this.directory = directory;
    }
    public String getId() {
        return id;
    }
    public String getDirectory() {
        return directory;
    }
}
