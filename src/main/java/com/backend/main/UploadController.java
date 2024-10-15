package com.backend.main;

import com.backend.body.Response;
import com.backend.body.VideoInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UploadController {

    private final UploadService uploadService;
    @Autowired
    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @Transactional
    @PostMapping("/upload")
    public ResponseEntity<Response> save(@RequestPart("video") MultipartFile multipartFile,
                                         @RequestPart("metadata") VideoInfo videoInfo) {

        if (videoInfo.getTitle() == null) {
            String message = "Title value cannot be NULL";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(message));
        }

        String videoId = uploadService.getVideo(multipartFile);
        if (videoId == null) {
            String message = "Video upload FAILED";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(message));
        }

        if (videoInfo.getThumbnail() == null) {
            byte[] result = uploadService.captureThumbnail(videoId);
            videoInfo.setThumbnail(result);
        }

        // -- save videoInfo in database
        boolean saved = uploadService.saveMetadata(videoId, videoInfo);
        if (!saved) {
            String message = "Metadata save FAILED";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(message));
        }

        // -- segment target video
        boolean segmented = uploadService.segmentVideo(videoId);
        if (!segmented) {
            uploadService.cleanup(videoId);
            String message = "Video segmentation FAILED";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(message));
        }

        // -- upload target video to Google Drive
        boolean uploaded = uploadService.uploadToCloud(videoId);
        if (!uploaded) {
            uploadService.cleanup(videoId);
            String message = "Google Drive upload FAILED";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(message));
        }

        // -- clean up the remains
        uploadService.cleanup(videoId);

        String message = "Upload SUCCESSFUL";
        System.out.println(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(new Response(message));
    }
}
