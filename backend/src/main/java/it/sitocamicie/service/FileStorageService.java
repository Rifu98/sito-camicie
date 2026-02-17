package it.sitocamicie.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    private final Path texturesDir;
    private final Path modelsDir;

    public FileStorageService(@Value("${app.storage.base:storage}") String baseDir) throws IOException {
        this.texturesDir = Path.of(baseDir, "textures");
        this.modelsDir = Path.of(baseDir, "models");
        Files.createDirectories(texturesDir);
        Files.createDirectories(modelsDir);
    }

    public Path storeTexture(MultipartFile file, String filename) throws IOException {
        String clean = StringUtils.cleanPath(filename);
        Path target = texturesDir.resolve(clean);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return target;
    }

    public Path storeModel(MultipartFile file, String filename) throws IOException {
        String clean = StringUtils.cleanPath(filename);
        Path target = modelsDir.resolve(clean);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return target;
    }

    public Path getTexturePath(String relative) {
        return texturesDir.resolve(relative);
    }

    public Path getModelPath(String relative) {
        return modelsDir.resolve(relative);
    }
}
