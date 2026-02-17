package it.sitocamicie.model;

import jakarta.persistence.*;
import java.util.Map;

@Entity
@Table(name = "component_models")
public class ComponentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ShirtComponent componentType;

    private String filePath;

    @Column(columnDefinition = "jsonb")
    private String metadata; // store JSON as text for simplicity

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ShirtComponent getComponentType() { return componentType; }
    public void setComponentType(ShirtComponent componentType) { this.componentType = componentType; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}
