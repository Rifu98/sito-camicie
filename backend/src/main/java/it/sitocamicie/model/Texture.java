package it.sitocamicie.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "textures")
public class Texture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String originalPath;
    private String processedPath;
    private String thumbnailPath;
    private String enhancedPath; // AI-enhanced output (dataURL or file name)
    private Boolean isTillable = true;
    private Instant uploadDate = Instant.now();

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOriginalPath() { return originalPath; }
    public void setOriginalPath(String originalPath) { this.originalPath = originalPath; }
    public String getProcessedPath() { return processedPath; }
    public void setProcessedPath(String processedPath) { this.processedPath = processedPath; }
    public String getThumbnailPath() { return thumbnailPath; }
    public void setThumbnailPath(String thumbnailPath) { this.thumbnailPath = thumbnailPath; }
    public String getEnhancedPath() { return enhancedPath; }
    public void setEnhancedPath(String enhancedPath) { this.enhancedPath = enhancedPath; }
    public Boolean getIsTillable() { return isTillable; }
    public void setIsTillable(Boolean isTillable) { this.isTillable = isTillable; }
    public Instant getUploadDate() { return uploadDate; }
    public void setUploadDate(Instant uploadDate) { this.uploadDate = uploadDate; }
}
