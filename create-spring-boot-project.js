const fs = require('fs');
const path = require('path');

const base = String.raw`C:\Users\Feder\Desktop\Sito camicie\backend`;

// File configurations
const files = {
    'pom.xml': `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.1</version>
        <relativePath/>
    </parent>
    
    <groupId>com.shirtconfig</groupId>
    <artifactId>shirt-configurator</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>Shirt Configurator</name>
    <description>3D Shirt Configurator Backend</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.15.1</version>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,

    'src/main/resources/application.properties': `spring.datasource.url=jdbc:postgresql://localhost:5432/shirt_configurator
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
server.port=8080

file.upload-dir=./uploads
file.models-dir=./uploads/models
file.textures-dir=./uploads/textures`,

    'src/main/java/com/shirtconfig/ShirtConfiguratorApplication.java': `package com.shirtconfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShirtConfiguratorApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShirtConfiguratorApplication.class, args);
    }
}`,

    'src/main/java/com/shirtconfig/entity/ComponentType.java': `package com.shirtconfig.entity;

public enum ComponentType {
    COLLAR,
    CUFF,
    SLEEVE,
    BODY,
    POCKET,
    BUTTON,
    STITCHING,
    SIDE_VENT,
    MONOGRAM
}`,

    'src/main/java/com/shirtconfig/entity/ComponentModel.java': `package com.shirtconfig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComponentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Enumerated(EnumType.STRING)
    private ComponentType componentType;
    
    private String filePath;
    
    @Column(columnDefinition = "TEXT")
    private String metadata;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}`,

    'src/main/java/com/shirtconfig/entity/Texture.java': `package com.shirtconfig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Texture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private String originalPath;
    
    private String processedPath;
    
    private String thumbnailPath;
    
    private Boolean isTillable = true;
    
    private LocalDateTime uploadDate;
    
    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}`,

    'src/main/java/com/shirtconfig/entity/ShirtConfiguration.java': `package com.shirtconfig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShirtConfiguration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String configurationJson;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}`,

    'src/main/java/com/shirtconfig/repository/ComponentModelRepository.java': `package com.shirtconfig.repository;

import com.shirtconfig.entity.ComponentModel;
import com.shirtconfig.entity.ComponentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentModelRepository extends JpaRepository<ComponentModel, Long> {
    List<ComponentModel> findByComponentType(ComponentType componentType);
}`,

    'src/main/java/com/shirtconfig/repository/TextureRepository.java': `package com.shirtconfig.repository;

import com.shirtconfig.entity.Texture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TextureRepository extends JpaRepository<Texture, Long> {
}`,

    'src/main/java/com/shirtconfig/repository/ShirtConfigurationRepository.java': `package com.shirtconfig.repository;

import com.shirtconfig.entity.ShirtConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShirtConfigurationRepository extends JpaRepository<ShirtConfiguration, Long> {
}`,

    'src/main/java/com/shirtconfig/service/FileStorageService.java': `package com.shirtconfig.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("\${file.models-dir}")
    private String modelsDir;
    
    @Value("\${file.textures-dir}")
    private String texturesDir;
    
    public String storeModelFile(MultipartFile file) throws IOException {
        return storeFile(file, modelsDir);
    }
    
    public String storeTextureFile(MultipartFile file) throws IOException {
        return storeFile(file, texturesDir);
    }
    
    private String storeFile(MultipartFile file, String directory) throws IOException {
        Path uploadPath = Paths.get(directory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String originalFilename = file.getOriginalFilename();
        String extension = FilenameUtils.getExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + "." + extension;
        
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return filePath.toString();
    }
    
    public void deleteFile(String filePath) throws IOException {
        if (filePath != null && !filePath.isEmpty()) {
            Path path = Paths.get(filePath);
            Files.deleteIfExists(path);
        }
    }
}`,

    'src/main/java/com/shirtconfig/service/TextureProcessingService.java': `package com.shirtconfig.service;

import org.springframework.stereotype.Service;

@Service
public class TextureProcessingService {
    
    public String generateThumbnail(String texturePath) {
        // TODO: Implementare generazione thumbnail
        // Per ora ritorna il path originale
        return texturePath;
    }
    
    public String processTexture(String texturePath) {
        // TODO: Implementare processing texture (resize, normalization, etc.)
        // Per ora ritorna il path originale
        return texturePath;
    }
    
    public boolean isTillable(String texturePath) {
        // TODO: Implementare controllo tillability
        return true;
    }
}`,

    'src/main/java/com/shirtconfig/controller/ComponentModelController.java': `package com.shirtconfig.controller;

import com.shirtconfig.entity.ComponentModel;
import com.shirtconfig.entity.ComponentType;
import com.shirtconfig.repository.ComponentModelRepository;
import com.shirtconfig.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "http://localhost:4200")
public class ComponentModelController {
    
    @Autowired
    private ComponentModelRepository componentModelRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping
    public ResponseEntity<List<ComponentModel>> getAllModels() {
        return ResponseEntity.ok(componentModelRepository.findAll());
    }
    
    @GetMapping("/{type}")
    public ResponseEntity<List<ComponentModel>> getModelsByType(@PathVariable ComponentType type) {
        return ResponseEntity.ok(componentModelRepository.findByComponentType(type));
    }
    
    @PostMapping
    public ResponseEntity<?> uploadModel(
            @RequestParam("name") String name,
            @RequestParam("componentType") ComponentType componentType,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "metadata", required = false) String metadata) {
        
        try {
            String filePath = fileStorageService.storeModelFile(file);
            
            ComponentModel model = new ComponentModel();
            model.setName(name);
            model.setComponentType(componentType);
            model.setFilePath(filePath);
            model.setMetadata(metadata);
            model.setCreatedAt(LocalDateTime.now());
            
            ComponentModel savedModel = componentModelRepository.save(model);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedModel);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload model: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModel(@PathVariable Long id) {
        return componentModelRepository.findById(id)
                .map(model -> {
                    try {
                        fileStorageService.deleteFile(model.getFilePath());
                        componentModelRepository.delete(model);
                        return ResponseEntity.ok().build();
                    } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Failed to delete file: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}`,

    'src/main/java/com/shirtconfig/controller/TextureController.java': `package com.shirtconfig.controller;

import com.shirtconfig.entity.Texture;
import com.shirtconfig.repository.TextureRepository;
import com.shirtconfig.service.FileStorageService;
import com.shirtconfig.service.TextureProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/textures")
@CrossOrigin(origins = "http://localhost:4200")
public class TextureController {
    
    @Autowired
    private TextureRepository textureRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private TextureProcessingService textureProcessingService;
    
    @GetMapping
    public ResponseEntity<List<Texture>> getAllTextures() {
        return ResponseEntity.ok(textureRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Texture> getTextureById(@PathVariable Long id) {
        return textureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadTexture(
            @RequestParam("name") String name,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isTillable", required = false, defaultValue = "true") Boolean isTillable) {
        
        try {
            String originalPath = fileStorageService.storeTextureFile(file);
            String processedPath = textureProcessingService.processTexture(originalPath);
            String thumbnailPath = textureProcessingService.generateThumbnail(originalPath);
            
            Texture texture = new Texture();
            texture.setName(name);
            texture.setOriginalPath(originalPath);
            texture.setProcessedPath(processedPath);
            texture.setThumbnailPath(thumbnailPath);
            texture.setIsTillable(isTillable);
            texture.setUploadDate(LocalDateTime.now());
            
            Texture savedTexture = textureRepository.save(texture);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTexture);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload texture: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTexture(@PathVariable Long id) {
        return textureRepository.findById(id)
                .map(texture -> {
                    try {
                        fileStorageService.deleteFile(texture.getOriginalPath());
                        fileStorageService.deleteFile(texture.getProcessedPath());
                        fileStorageService.deleteFile(texture.getThumbnailPath());
                        textureRepository.delete(texture);
                        return ResponseEntity.ok().build();
                    } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Failed to delete files: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}`,

    'src/main/java/com/shirtconfig/config/CorsConfig.java': `package com.shirtconfig.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}`,

    'src/main/java/com/shirtconfig/controller/ShirtConfigurationController.java': `package com.shirtconfig.controller;

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
}`,

    '.gitignore': `HELP.md
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### VS Code ###
.vscode/

### Uploads ###
uploads/`
};

// Create directories and files
console.log('Creating Spring Boot project structure...\\n');

Object.keys(files).forEach(filePath => {
    const fullPath = path.join(base, filePath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(\`Created directory: \${dir}\`);
    }
    
    // Write file
    fs.writeFileSync(fullPath, files[filePath], 'utf-8');
    console.log(\`Created file: \${filePath}\`);
});

console.log('\\n✅ Spring Boot project created successfully!');
console.log('\\nNext steps:');
console.log('1. cd backend');
console.log('2. mvn clean install');
console.log('3. mvn spring-boot:run');
