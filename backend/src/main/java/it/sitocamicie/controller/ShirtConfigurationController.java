package it.sitocamicie.controller;

import it.sitocamicie.model.ShirtConfiguration;
import it.sitocamicie.repository.ShirtConfigurationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/configurations")
@CrossOrigin(origins = "http://localhost:4200")
public class ShirtConfigurationController {

    private final ShirtConfigurationRepository repository;

    public ShirtConfigurationController(ShirtConfigurationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ShirtConfiguration> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShirtConfiguration> get(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ShirtConfiguration save(@RequestBody ShirtConfiguration cfg) {
        return repository.save(cfg);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repository.findById(id).map(c -> {
            repository.delete(c);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
