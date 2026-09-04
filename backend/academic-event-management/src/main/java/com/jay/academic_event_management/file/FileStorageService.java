package com.jay.academic_event_management.file;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir =
            "C:/Projectty/Academic-Event-Management-System/uploads/";

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public String saveFile(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IOException("Only image files (JPEG, PNG, GIF, WebP) are allowed");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IOException("File size must not exceed 10MB");
        }

        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "unknown";
        }

        // Sanitize filename: remove path separators and dangerous characters
        String safeFilename = originalFilename
                .replaceAll("[^a-zA-Z0-9._-]", "_")
                .replaceAll("\\.{2,}", ".");

        String fileName = UUID.randomUUID() + "_" + safeFilename;

        Files.copy(
                file.getInputStream(),
                uploadPath.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING
        );

        return fileName;
    }
}