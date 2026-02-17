package it.sitocamicie.controller;

import it.sitocamicie.model.ComponentModel;
import it.sitocamicie.model.ShirtComponent;
import it.sitocamicie.repository.ComponentModelRepository;
import it.sitocamicie.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "http://localhost:4200")
public class ComponentModelController {

    private final ComponentModelRepository repository;
    private final FileStorageService fileStorageService;

    public ComponentModelController(ComponentModelRepository repository, FileStorageService fileStorageService) {
        this.repository = repository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<ComponentModel> list() {
        return repository.findAll();
    }

    @GetMapping("/{type}")
    public List<ComponentModel> listByType(@PathVariable String type) {
        ShirtComponent sc = ShirtComponent.valueOf(type.toUpperCase());
        return repository.findByComponentType(sc);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ComponentModel upload(@RequestParam("file") MultipartFile file,
                                 @RequestParam("name") String name,
                                 @RequestParam("componentType") String componentType) throws Exception {
        Path stored = fileStorageService.storeModel(file, file.getOriginalFilename());
        ComponentModel m = new ComponentModel();
        m.setName(name);
        m.setComponentType(ShirtComponent.valueOf(componentType));
        m.setFilePath(stored.getFileName().toString());
        return repository.save(m);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComponentModel> update(@PathVariable Long id, @RequestBody ComponentModel update) {
        return repository.findById(id).map(existing -> {
            existing.setName(update.getName());
            existing.setMetadata(update.getMetadata());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repository.findById(id).map(m -> {
            repository.delete(m);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/file/{name}")
    public ResponseEntity<org.springframework.core.io.Resource> serveModel(@PathVariable String name) throws Exception {
        Path p = fileStorageService.getModelPath(name);
        org.springframework.core.io.Resource r = new org.springframework.core.io.UrlResource(p.toUri());
        return ResponseEntity.ok().body(r);
    }
}
