package it.sitocamicie.controller;

import it.sitocamicie.model.Texture;
import it.sitocamicie.repository.TextureRepository;
import it.sitocamicie.service.FileStorageService;
import it.sitocamicie.service.TextureProcessingService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/textures")
@CrossOrigin(origins = "http://localhost:4200")
public class TextureController {

    private final TextureRepository textureRepository;
    private final TextureProcessingService textureProcessingService;
    private final FileStorageService fileStorageService;

    public TextureController(TextureRepository textureRepository,
                             TextureProcessingService textureProcessingService,
                             FileStorageService fileStorageService) {
        this.textureRepository = textureRepository;
        this.textureProcessingService = textureProcessingService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<Texture> list() {
        return textureRepository.findAll();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Texture upload(@RequestParam("file") MultipartFile file,
                          @RequestParam(value = "name", required = false) String name) throws Exception {
        return textureProcessingService.saveAndProcess(file, name);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Texture> get(@PathVariable Long id) {
        return textureRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return textureRepository.findById(id).map(t -> {
            textureRepository.delete(t);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/file/{name}")
    public ResponseEntity<Resource> serveFile(@PathVariable String name) throws MalformedURLException {
        Path p = fileStorageService.getTexturePath(name);
        Resource r = new UrlResource(p.toUri());
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + r.getFilename() + "\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(r);
    }
}
