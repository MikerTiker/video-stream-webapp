package com.backend.main;

import com.backend.body.VideoInfo;
import com.backend.db.table.Video;
import com.backend.db.table.VideoRep;
import com.backend.utility.GoogleDriveUploader;
import com.backend.utility.VideoProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.UUID;

@Service
public class UploadService {

    private final VideoRep videoRep;
    @Autowired
    public UploadService(VideoRep videoRep) {
        this.videoRep = videoRep;
    }

    private final String currentDir = System.getProperty("user.dir");

    public String getVideo(MultipartFile file) {
        String newId = UUID.randomUUID().toString();
        File videoDir = new File(currentDir + "/src/temp/" + newId + "/video");

        boolean successful = videoDir.mkdirs();
        if (!successful) {
            cleanup(newId);
            System.err.println("Directory creation failed.");
            return null;
        }

        try {
            Path path = Paths.get(videoDir + "/" + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            System.err.println(e.getMessage());
            return null;
        }

        return newId;
    }

    public boolean saveMetadata(String videoId, VideoInfo videoInfo) {
        System.out.println("Saving metadata in database...");
        Video video = new Video();
        video.setVideoId(videoId);
        video.setTitle(videoInfo.getTitle());
        video.setDescription(videoInfo.getDescription());
        video.setThumbnail(videoInfo.getThumbnail());
        videoRep.save(video);

        Video verifySave = videoRep.findByVideoId(video.getVideoId());
        return verifySave != null;
    }

    public boolean segmentVideo(String id) {
        System.out.println("Segmenting target video...");
        String segmentDirStr = currentDir + "/src/temp/" + id + "/segment";
        String videoDirStr = currentDir + "/src/temp/" + id + "/video";

        File segmentDir = new File(segmentDirStr);
        if (!segmentDir.exists() && !segmentDir.mkdir()) {
            System.err.println("Segment directory creation failed.");
            return false;
        }

        File videoDir = new File(videoDirStr);
        if (!videoDir.exists()) {
            System.err.println("Video directory doesn't exist");
            return false;
        }
        File[] videos = videoDir.listFiles();
        assert videos != null;
        if (videos.length > 1) {
            System.err.println("Multiple video files were found.");
            return false;
        }

        String input, output;
        input = videoDirStr + "/" + videos[0].getName();
        output = segmentDirStr + "/seg%03d.mp4";

        try {
            return VideoProcessor.segment(input, output);
        } catch (IOException | InterruptedException exception) {
            System.err.println(exception.getMessage());
            return false;
        }
    }
    public byte[] captureThumbnail(String id) {
        System.out.println("Capturing thumbnail...");
        String thumbDirStr = currentDir + "/src/temp/" + id + "/thumbnail";
        String videoDirStr = currentDir + "/src/temp/" + id + "/video";

        File thumbDir = new File(thumbDirStr);
        if (!thumbDir.exists() && !thumbDir.mkdir()) {
            System.err.println("Thumbnail directory creation failed.");
            return null;
        }

        File videoDir = new File(videoDirStr);
        if (!videoDir.exists()) {
            System.err.println("Video directory doesn't exist");
            return null;
        }
        File[] videos = videoDir.listFiles();
        assert videos != null;
        if (videos.length > 1) {
            System.err.println("Multiple video files were found.");
            return null;
        }

        String input, output;
        input = videoDirStr + "/" + videos[0].getName();
        output = thumbDirStr + "/thumbnail.jpg";

        try {
            boolean captured = VideoProcessor.capture(input, output);
            if (!captured) {
                System.err.println("Thumbnail capture failed.");
                return null;
            }
        } catch (IOException | InterruptedException exception) {
            System.err.println(exception.getMessage());
            return null;
        }

        File thumbFile = new File(output);
        byte[] thumbnail;
        try (FileInputStream fileInputStream = new FileInputStream(thumbFile)) {
            thumbnail = new byte[(int) thumbFile.length()];
            int converted = fileInputStream.read(thumbnail);

            if (converted == -1) {
                System.err.println("Image to byte array conversion failed.");
                return null;
            }
        } catch (IOException e) {
            System.err.println(e.getMessage());
            return null;
        }
        return thumbnail;
    }

    public boolean uploadToCloud(String id) {
        System.out.println("Uploading segments to cloud...");
        GoogleDriveUploader uploader = new GoogleDriveUploader(id);

        File segmentDir = new java.io.File(currentDir + "/src/temp/" + id + "/segment");
        if (!segmentDir.exists()) {
            System.err.println("Segment directory doesn't exist.");
            return false;
        }
        File[] videos = segmentDir.listFiles();
        if (videos == null || videos.length == 0) {
            System.err.println("Segment directory is empty.");
            return false;
        }

        try {
            String folderId = uploader.uploadFolder();
            System.out.println("Uploaded Folder ID: " + folderId);

            for (File video : videos) {
                String videoId = uploader.uploadVideo(folderId, video);
                System.out.println("Uploaded Video ID: " + videoId);
            }
        } catch (IOException e) {
            System.err.println(e.getMessage());
            return false;
        }
        return true;
    }

    public boolean remains(String id) {
        Path idDirPath = Paths.get(currentDir + "/src/temp/" + id);

        File idDir = new File(idDirPath.toString());
        if (!idDir.exists()) {
            System.err.println("Cannot cleanup because target directory doesn't exist.");
            return false;
        }

        try {
            Files.walkFileTree(idDirPath, new SimpleFileVisitor<>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attributes) throws IOException {
                    Files.delete(file);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException e) throws IOException {
                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            System.err.println(e.getMessage());
            return false;
        }
        return true;
    }

    public void cleanup(String id) {
        boolean cleaned = remains(id);
        if (!cleaned) {
            System.err.println("Cleanup failed: " + id);
        }
    }
}
