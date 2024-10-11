package com.backend.utility;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;

public class GoogleDriveUploader {
    private final String videoId;
    public GoogleDriveUploader(String videoId) {
        this.videoId = videoId;
    }
    private static final String APPLICATION_NAME = "Video Streaming Web App";
    private static final String DRIVE_PARENT_ID = "1vi0t4lhidRPyl9qPoI6WPkExiuWVFwGN";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String SERVICE_ACCOUNT_KEY_PATH = getCredentials();
    private static final Drive DRIVE = getDriveService();

    private static String getCredentials() {
        String currentDir = System.getProperty("user.dir");
        Path filePath = Paths.get(currentDir, "src/credential/key.json");
        return filePath.toString();
    }
    private static Drive getDriveService() {
        try {
            GoogleCredentials credentials = ServiceAccountCredentials.fromStream(new FileInputStream(SERVICE_ACCOUNT_KEY_PATH))
                    .createScoped(Collections.singleton(DriveScopes.DRIVE_FILE));
            return new Drive.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    new HttpCredentialsAdapter(credentials))
                    .setApplicationName(APPLICATION_NAME)
                    .build();
        } catch (IOException | GeneralSecurityException exception) {
            throw new RuntimeException(exception);
        }
    }

    public String uploadFolder() throws IOException {
        File folderMetadata = new File();
        folderMetadata.setName(videoId);
        folderMetadata.setParents(Collections.singletonList(DRIVE_PARENT_ID));
        folderMetadata.setMimeType("application/vnd.google-apps.folder");

        File uploadedFolder = DRIVE.files().create(folderMetadata)
                .setFields("id")
                .execute();

        return uploadedFolder.getId();
    }
    public String uploadVideo(String parentId, java.io.File file) throws IOException {
        File fileMetadata = new File();
        fileMetadata.setName(file.getName());
        fileMetadata.setParents(Collections.singletonList(parentId));
        FileContent mediaContent = new FileContent("video/mp4", file);

        File uploadedFile = DRIVE.files().create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();

        return uploadedFile.getId();
    }
}
