package com.shirtconfig.controller;

import com.shirtconfig.entity.ShirtConfiguration;
import com.shirtconfig.repository.ShirtConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/configurations")
@CrossOrigin(origins = "http://localhost:4200")
public class ShirtConfigurationController {
    
    @Autowired
    private ShirtConfigurationRepository configurationRepository;
    
    @GetMapping
    public ResponseEntity<List<ShirtConfiguration>> getAllConfigurations() {
        return ResponseEntity.ok(configurationRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ShirtConfiguration> getConfigurationById(@PathVariable Long id) {
        return configurationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ShirtConfiguration> saveConfiguration(@RequestBody String configurationJson) {
        ShirtConfiguration configuration = new ShirtConfiguration();
        configuration.setConfigurationJson(configurationJson);
        configuration.setCreatedAt(LocalDateTime.now());
        
        ShirtConfiguration saved = configurationRepository.save(configuration);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteConfiguration(@PathVariable Long id) {
        return configurationRepository.findById(id)
                .map(config -> {
                    configurationRepository.delete(config);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
