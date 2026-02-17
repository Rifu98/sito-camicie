# Piano Implementazione - Configuratore Camicie 3D

## Stato implementazione (sintesi)
- FASE 1-9: completate (scaffold repository, API core, texture processing placeholder, frontend configuratore 3D base, admin upload) ✅
- Autenticazione admin: aggiunta (JWT, demo in-memory user) ✅
- Monogramma client-side (canvas → texture) implementato ✅
- Docker Compose per sviluppo (Postgres + backend + frontend) aggiunto ✅
- Rimanente: algoritmo seamless avanzato, raccolta/ottimizzazione asset 3D reali, test E2E (Cypress), UI polish avanzato, caching e ottimizzazioni Three.js

## Panoramica
Sistema di personalizzazione camicie con rendering 3D, composto da:
- **Frontend Angular**: interfaccia utente per configurazione 3D + pannello admin
- **Backend Spring Boot**: API REST, gestione upload, processing texture
- **Database PostgreSQL**: storage modelli e metadati texture
- **File System locale**: storage immagini/modelli 3D

## Tecnologie Scelte

### Frontend
- **Angular 18+** (standalone components)
- **Three.js** per rendering 3D (libreria più matura, ottima integrazione Angular via `@angular/cdk`)
- **Angular Material** per UI admin
- **ngx-dropzone** per drag&drop upload (fase successiva)

### Backend
- **Spring Boot 3.x**
- **Spring Data JPA** + **PostgreSQL**
- **OpenCV/ImageMagick** (via ProcessBuilder) per texture processing
- **Lombok** per ridurre boilerplate

### 3D & Texture Processing
- **Modello 3D base**: GLB format (ricerca su Sketchfab/TurboSquid free models, o generazione procedurale)
- **Texture processing pipeline**:
  1. Upload foto originale (JPG/PNG)
  2. Auto-crop e normalizzazione
  3. Estrazione pattern tillable (seamless texture generation)
  4. Generazione thumbnail per preview

---

## Componenti Personalizzabili

### 1. Collo (Collar)
- **Modelli**: Italiano, Francese, Button-down, Coreano, Smoking, Mao, Classico
- **Varianti**: 1 o 2 bottoni, con/senza stecche
- **Texture**: applicabile

### 2. Polsini (Cuffs)
- **Modelli**: Semplice (1 bottone), Doppio (2 bottoni), Francese (gemelli), Arrotondato
- **Texture**: applicabile

### 3. Maniche (Sleeves)
- **Lunghezza**: Corta, Lunga
- **Texture**: applicabile

### 4. Corpo/Torso (Body)
- **Fit**: Slim, Regular, Comfort
- **Lunghezza**: Normale, Lunga
- **Texture**: applicabile

### 5. Tasche (Pockets)
- **Presenza**: Sì/No
- **Modelli**: Squadrata, Arrotondata, Con pattina
- **Posizione**: Sinistra, Destra, Entrambe
- **Texture**: applicabile

### 6. Bottoni (Buttons)
- **Tipologie**: Piatti, Bombati, Madreperla, Legno, Metallo
- **Colore**: Bianco, Nero, Grigio, Oro, Argento, Match tessuto
- **Dimensione**: Piccolo, Medio, Grande

### 7. Cuciture (Stitching)
- **Colore**: Match tessuto, Contrasto (20+ colori standard)
- **Tipo**: Semplice, Doppia
- **Visibilità**: Normale, Rinforzata

### 8. Spacchi Laterali (Side Vents)
- **Modelli**: Dritto, Arrotondato, Assente

### 9. Monogramma (Monogram)
- **Presenza**: Sì/No
- **Posizione**: Polso sinistro, Polso destro, Torace, Taschino
- **Font**: 5-7 stili (Script, Block, Italic, etc.)
- **Colore**: Match cuciture o custom
- **Testo**: max 3-4 caratteri

---

## Workplan

### FASE 1: Setup Progetto
- [ ] Creare struttura repository (root con /frontend, /backend)
- [ ] Inizializzare progetto Angular con routing e struttura moduli
- [ ] Inizializzare progetto Spring Boot con dipendenze (JPA, Web, PostgreSQL, Lombok)
- [ ] Setup PostgreSQL locale e configurazione application.properties
- [ ] Creare .gitignore e README

### FASE 2: Backend - Database & Entities
- [ ] Entity `ShirtComponent` (enum: COLLAR, CUFF, SLEEVE, etc.)
- [ ] Entity `ComponentModel` (id, nome, tipo componente, path file 3D parziale, metadata)
- [ ] Entity `Texture` (id, nome, path originale, path processed, path thumbnail, tillable flag)
- [ ] Entity `ShirtConfiguration` (salvataggio configurazioni utente - opzionale fase successiva)
- [ ] Repository layer per tutte le entities
- [ ] Flyway/Liquibase migration per schema iniziale

### FASE 3: Backend - API Core
- [ ] REST Controller `ComponentModelController`
  - GET `/api/models` - lista tutti i modelli raggruppati per tipo
  - GET `/api/models/{type}` - modelli per tipo componente
  - POST `/api/models` - upload nuovo modello (admin)
  - PUT `/api/models/{id}` - update modello
  - DELETE `/api/models/{id}` - delete modello
- [ ] REST Controller `TextureController`
  - GET `/api/textures` - lista texture con thumbnails
  - POST `/api/textures/upload` - upload foto + processing
  - GET `/api/textures/{id}` - dettaglio texture
  - DELETE `/api/textures/{id}` - delete texture
- [ ] File upload service con validazione (max size, formati permessi)
- [ ] Static resource serving per immagini e modelli 3D

### FASE 4: Backend - Texture Processing
- [ ] Service `TextureProcessingService`
  - Crop automatico e resize
  - Seamless texture generation (algoritmo tile generation o AI-based)
  - Thumbnail generation
  - Save multi-resolution (original, processed, thumbnail)
- [ ] Integrazione OpenCV o libreria Java equivalente (Thumbnailator + custom logic)
- [ ] Job asincrono per processing (Spring @Async o task executor)

### FASE 5: Frontend - Setup Base
- [ ] Struttura routing: `/configurator` (utente), `/admin` (admin)
- [ ] Layout principale con navbar
- [ ] Setup Angular Material theme
- [ ] Service `ApiService` per chiamate HTTP al backend
- [ ] Modelli TypeScript per entities (ComponentModel, Texture, Configuration)

### FASE 6: Frontend - Vista 3D (Three.js)
- [ ] Component `Shirt3DViewerComponent`
- [ ] Integrazione Three.js: scene, camera, renderer, lights
- [ ] Caricamento modello GLB base camicia
- [ ] Orbit controls per rotazione/zoom
- [ ] Sistema di mapping texture su mesh parts
  - Identificare submeshes per ogni componente (collar, cuffs, body, etc.)
  - Applicare texture dinamicamente via Three.js materials
- [ ] Gestione swap modelli 3D parziali (es: cambio forma collo)
- [ ] Responsive canvas (resize on window resize)

### FASE 7: Frontend - Configuratore Utente
- [ ] Component `ConfiguratorComponent` (container principale)
- [ ] Sidebar con tabs per ogni componente personalizzabile
- [ ] Per ogni tab:
  - [ ] Lista modelli disponibili (con preview 2D thumbnail)
  - [ ] Lista texture disponibili (con preview)
  - [ ] Selezione attiva evidenziata
- [ ] Gestione stato configurazione corrente (service + RxJS BehaviorSubject)
- [ ] Comunicazione sidebar → 3D viewer per aggiornamento real-time
- [ ] Pannello recap configurazione (summary con scelte utente)

### FASE 8: Frontend - Configurazione Specifica Componenti
- [ ] Panel Collo: dropdown modello + grid texture
- [ ] Panel Polsini: dropdown modello + grid texture
- [ ] Panel Maniche: toggle corta/lunga + grid texture
- [ ] Panel Corpo: fit dropdown + lunghezza toggle + grid texture
- [ ] Panel Tasche: presenza toggle + modello dropdown + posizione + grid texture
- [ ] Panel Bottoni: tipologia + colore + dimensione (no texture)
- [ ] Panel Cuciture: color picker (predefined palette)
- [ ] Panel Spacchi: dropdown modello
- [ ] Panel Monogramma: toggle presenza + input text + posizione + font + colore

### FASE 9: Frontend - Admin Panel
- [ ] Routing guard per protezione `/admin` (opzionale auth fase successiva)
- [ ] Dashboard admin con sezioni:
  - [ ] Gestione Modelli 3D
  - [ ] Gestione Texture
- [ ] Component `ModelManagementComponent`
  - [ ] Tabella modelli esistenti (Angular Material Table)
  - [ ] Form upload nuovo modello (tipo componente, nome, file GLB)
  - [ ] Edit/Delete azioni
- [ ] Component `TextureManagementComponent`
  - [ ] Gallery texture esistenti con thumbnails
  - [ ] Upload form con anteprima pre-upload
  - [ ] Indicatore processing status (uploaded → processing → ready)
  - [ ] Edit nome/delete azioni

### FASE 10: Ricerca/Creazione Modelli 3D
- [ ] Ricerca modello base camicia royalty-free (Sketchfab, Free3D, CGTrader free section)
- [ ] Verifica formato GLB e struttura mesh (submeshes separate per componenti)
- [ ] Se necessario: conversione da FBX/OBJ a GLB (Blender script)
- [ ] Creazione varianti modelli per:
  - [ ] Colli (almeno 3-4 varianti iniziali)
  - [ ] Polsini (2-3 varianti)
  - [ ] Tasche (2-3 varianti)
- [ ] Naming convention chiara per file 3D
- [ ] Popolazione database con modelli iniziali (SQL seed o API upload)

### FASE 11: Texture di Esempio & Testing
- [ ] Raccolta 5-10 foto tessuti di esempio
- [ ] Test pipeline processing texture
- [ ] Validazione qualità output (seamless tiles)
- [ ] Popolamento database con texture iniziali
- [ ] Test applicazione texture su modello 3D (qualità rendering)

### FASE 12: UI/UX Polish
- [ ] Design sistema colori e typography coerente
- [ ] Animazioni transizioni (cambio modello/texture)
- [ ] Loading states e spinners
- [ ] Error handling UI (upload fallito, modello non caricato, etc.)
- [ ] Responsive design (tablet/mobile - 3D viewer adattivo)
- [ ] Tooltips e helper text

### FASE 13: Ottimizzazioni & Performance
- [ ] Lazy loading moduli Angular
- [ ] Compressione texture (JPEG quality optimization, WebP support)
- [ ] Caching texture/modelli già caricati (frontend)
- [ ] HTTP caching headers (backend)
- [ ] Three.js: geometry instancing per componenti ripetuti
- [ ] Debouncing chiamate API durante selezione rapida

### FASE 14: Testing & Bug Fixing
- [ ] Test end-to-end flow utente (configurazione completa)
- [ ] Test admin: upload modelli e texture
- [ ] Test edge cases (file corrotti, formati non supportati, etc.)
- [ ] Test compatibilità browser (Chrome, Firefox, Safari, Edge)
- [ ] Fix bug critici

### FASE 15: Miglioramenti Futuri (Opzionali)
- [ ] Autenticazione admin (Spring Security + JWT)
- [ ] Salvataggio configurazioni utente (con/senza login)
- [ ] Condivisione configurazione via link
- [ ] Export immagine configurazione (screenshot 3D)
- [ ] Drag & drop upload texture (ngx-dropzone)
- [ ] AI texture enhancement (upscaling, denoising)
- [ ] Configurazione luci 3D personalizzabili
- [ ] Modalità comparazione (2 configurazioni side-by-side)

---

## Note Tecniche

### Struttura Modello 3D
Il modello GLB dovrà avere una gerarchia tipo:
```
Shirt (root)
├── Body
├── Collar
├── Cuffs_Left
├── Cuffs_Right
├── Sleeves_Left
├── Sleeves_Right
├── Pocket_Left (optional)
├── Pocket_Right (optional)
├── Buttons
└── Stitching (edges)
```

Ogni submesh deve avere UV mapping corretto per texture tiling.

### Texture Processing Algorithm
1. **Input**: foto RGB 3000x4000px circa
2. **Preprocessing**: auto-rotate, crop bordi
3. **Pattern extraction**: 
   - Detect repeating pattern (FFT analysis o tile sampling)
   - Extract smallest repeating unit (es: 512x512px)
4. **Seamless generation**: 
   - Mirror edges blending
   - Offset filter technique (Photoshop-like)
5. **Output**: 
   - Original (backup)
   - Processed tillable (1024x1024px)
   - Thumbnail (256x256px)

### Database Schema (semplificato)
```sql
component_models (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100),
  component_type VARCHAR(50), -- COLLAR, CUFF, etc.
  file_path VARCHAR(255),
  metadata JSONB -- extra properties
)

textures (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100),
  original_path VARCHAR(255),
  processed_path VARCHAR(255),
  thumbnail_path VARCHAR(255),
  is_tillable BOOLEAN DEFAULT true,
  upload_date TIMESTAMP
)

shirt_configurations (
  id BIGSERIAL PRIMARY KEY,
  configuration_json JSONB, -- {collar_model_id, collar_texture_id, ...}
  created_at TIMESTAMP
)
```

---

## Milestone Principali

1. **MVP Backend** (FASE 1-4): API funzionanti + texture processing
2. **MVP Frontend 3D** (FASE 5-7): Viewer 3D + configuratore base
3. **MVP Completo** (FASE 8-9): Tutti i componenti + admin
4. **Release Candidate** (FASE 10-13): Modelli 3D reali + polish
5. **Production Ready** (FASE 14): Testing completo

---

## Stima Complessità
- **Backend**: ~25 ore
- **Frontend**: ~40 ore  
- **3D Assets**: ~15 ore
- **Testing/Polish**: ~10 ore
- **TOTALE**: ~90 ore (escludendo miglioramenti futuri)
