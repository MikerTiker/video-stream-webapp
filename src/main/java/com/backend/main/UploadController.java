package com.backend.main;

import com.backend.body.Directory;
import com.backend.body.VideoInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UploadController {

    private final UploadService uploadService;
    @Autowired
    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @GetMapping("/dir")
    public ResponseEntity<Directory> directory() {
        Directory dir = uploadService.createDir();
        if (dir == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(dir);
    }

    @Transactional
    @PostMapping("/upload")
    public ResponseEntity<String> save(@RequestBody VideoInfo videoInfo) {

        if (videoInfo.getId() == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Video ID cannot be NULL!");
        if (videoInfo.getTitle() == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Title value cannot be NULL!");

        String videoId = videoInfo.getId();
        if (videoInfo.getThumbnail() == null) {
            byte[] result = uploadService.captureThumbnail(videoId);
            videoInfo.setThumbnail(result);
        }

        // -- save videoInfo in database
        boolean saved = uploadService.saveMetadata(videoInfo);
        if (!saved)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Metadata save failed!");

        // -- segment target video
        boolean segmented = uploadService.segmentVideo(videoId);
        if (!segmented) {
            uploadService.cleanup(videoId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Video segmentation failed.");
        }

        // -- upload target video to Google Drive
        boolean uploaded = uploadService.uploadToCloud(videoId);
        if (!uploaded) {
            uploadService.cleanup(videoId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google Drive upload failed.");
        }

        // -- clean up the remains
        uploadService.cleanup(videoId);

        return ResponseEntity.status(HttpStatus.CREATED).body("Upload successful!");
    }
}
