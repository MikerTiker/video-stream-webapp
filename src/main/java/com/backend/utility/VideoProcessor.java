package com.backend.utility;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class VideoProcessor {
    private static void consumeStream(InputStream inputStream) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private static boolean execute(String[] command) throws IOException, InterruptedException {
        ProcessBuilder builder = new ProcessBuilder(command);
        builder.redirectErrorStream(true);
        Process process = builder.start();

        new Thread(() -> consumeStream(process.getInputStream())).start();
        new Thread(() -> consumeStream(process.getErrorStream())).start();

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            System.err.println("Command execution failed. Exit Code: " + exitCode);
            return false;
        }
        System.out.println("Command executed!");
        return true;
    }


    public static boolean segment(String input, String output) throws IOException, InterruptedException {
        String[] command = {
                "ffmpeg",
                "-fflags", "+genpts",
                "-i", input,
                "-c:a", "copy",
                "-f", "segment",
                "-segment_time", "10",
                "-c:v", "copy",
                "-reset_timestamps", "1",
                "-map", "0",
                output
        };
        return execute(command);
    }
    public static boolean capture(String input, String output) throws IOException, InterruptedException {
        String[] command = {
                "ffmpeg",
                "-i", input,
                "-vf", "\"select=eq(n\\,0),scale=640:-1\"",
                "-vsync", "vfr",
                output
        };
        return execute(command);
    }
}
