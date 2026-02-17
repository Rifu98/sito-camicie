# Shirt Configurator - Backend Setup

## Creazione Progetto

Per creare la struttura completa del progetto Spring Boot, esegui:

```bash
node create-spring-boot-project.js
```

Questo creerà:
- Tutte le directory necessarie
- File pom.xml con dipendenze
- Entities (ComponentType, ComponentModel, Texture, ShirtConfiguration)
- Repositories (JPA)
- Services (FileStorageService, TextureProcessingService)
- Controllers (ComponentModelController, TextureController)
- Configurazioni (CORS, application.properties)
- Main Application class

## Requisiti

- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Node.js (solo per script di setup)

## Setup Database

1. Crea database PostgreSQL:
```sql
CREATE DATABASE shirt_configurator;
```

2. Le tabelle verranno create automaticamente da Hibernate

## Avvio Applicazione

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

L'applicazione sarà disponibile su: http://localhost:8080

## API Endpoints

### Component Models
- GET `/api/models` - Tutti i modelli
- GET `/api/models/{type}` - Modelli per tipo (COLLAR, CUFF, SLEEVE, etc.)
- POST `/api/models` - Upload nuovo modello (multipart/form-data)
- DELETE `/api/models/{id}` - Elimina modello

### Textures
- GET `/api/textures` - Tutte le texture
- GET `/api/textures/{id}` - Texture per ID
- POST `/api/textures/upload` - Upload texture (multipart/form-data)
- DELETE `/api/textures/{id}` - Elimina texture

## Struttura Progetto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/shirtconfig/
│   │   │   ├── entity/
│   │   │   │   ├── ComponentType.java (enum)
│   │   │   │   ├── ComponentModel.java
│   │   │   │   ├── Texture.java
│   │   │   │   └── ShirtConfiguration.java
│   │   │   ├── repository/
│   │   │   │   ├── ComponentModelRepository.java
│   │   │   │   ├── TextureRepository.java
│   │   │   │   └── ShirtConfigurationRepository.java
│   │   │   ├── service/
│   │   │   │   ├── FileStorageService.java
│   │   │   │   └── TextureProcessingService.java
│   │   │   ├── controller/
│   │   │   │   ├── ComponentModelController.java
│   │   │   │   └── TextureController.java
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java
│   │   │   └── ShirtConfiguratorApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Dipendenze Maven

- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- postgresql (driver)
- lombok
- commons-io

## CORS Configuration

CORS abilitato per: http://localhost:4200 (Angular frontend)

## File Upload

- Max file size: 10MB
- Directory upload: ./uploads/
- Models: ./uploads/models/
- Textures: ./uploads/textures/

## Note

- TextureProcessingService è uno stub - implementare processing successivamente
- Metadata nei ComponentModel memorizzato come JSON TEXT
- Timestamp automatici con @PrePersist
