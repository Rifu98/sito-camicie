# Configuratore Camicie 3D

Sistema di personalizzazione camicie con rendering 3D real-time.

## Tecnologie

### Frontend
- Angular 18+
- Three.js per rendering 3D
- Angular Material

### Backend
- Spring Boot 3.x
- PostgreSQL
- Spring Data JPA

## Setup Rapido

### Prerequisiti
- Node.js 18+ e npm
- Java 17+
- PostgreSQL 14+
- Angular CLI: `npm install -g @angular/cli`

### Installazione

1. **Backend**:
```bash
cd backend
./mvnw spring-boot:run
```

2. **Frontend**:
```bash
cd frontend
npm install
npm start
```

3. **Database**:
Crea database PostgreSQL:
```sql
CREATE DATABASE shirt_configurator;
```

## Struttura Progetto

```
├── frontend/          # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── configurator/    # Vista utente 3D
│   │   │   ├── admin/           # Pannello admin
│   │   │   ├── shared/          # Services e models
│   │   │   └── ...
│   └── ...
├── backend/           # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/shirtconfig/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       ├── service/
│   │   │   │       └── controller/
│   │   │   └── resources/
│   │   │       ├── static/
│   │   │       │   ├── models/     # File 3D GLB
│   │   │       │   └── textures/   # Immagini texture
│   │   │       └── application.properties
│   └── ...
└── PIANO_IMPLEMENTAZIONE.md
```

## Funzionalità

- ✅ Configuratore 3D interattivo
- ✅ 9 componenti personalizzabili (collo, polsini, maniche, corpo, tasche, bottoni, cuciture, spacchi, monogramma)
- ✅ Upload e processing automatico texture
- ✅ Admin panel per gestione modelli e texture
- ✅ Rotazione e zoom modello 3D

## Licenza

Proprietario
