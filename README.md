# Sito Camicie — Configuratore 3D (skeleton)

Repository iniziale per il progetto "Configuratore Camicie 3D".

Stato attuale
- Implementata la struttura di repository (cartelle `frontend/` e `backend/`)
- Backend Spring Boot: entità JPA, repository, controller REST, storage file, texture processing async, autenticazione JWT (demo)
- Frontend Angular: standalone components, Three.js viewer placeholder, upload texture/model, login admin, save/load configurazioni

Documentazione di progetto: vedere `PIANO_IMPLEMENTAZIONE.md`

Credenziali demo (admin):
- username: `admin`
- password: `admin`

Eseguire in locale
1) Backend
   - configurare PostgreSQL o adattare `backend/src/main/resources/application.properties`
   - mvn -f backend -DskipTests package
   - mvn -f backend spring-boot:run

2) Frontend
   - cd frontend
   - npm ci
   - npx ng serve
   - apri http://localhost:4200

3) Note
   - Per operazioni Admin (upload model/texture) effettua login nella UI (admin/admin) — il backend protegge le richieste non-GET
   - I modelli 3D devono essere caricati in formato GLB e verranno serviti da `/api/models/file/{name}`

Comandi Docker
- docker build -t sito-camicie-backend ./backend
- docker build -t sito-camicie-frontend ./frontend

Prossimi miglioramenti possibili
- Algoritmo real seamless texture
- UI polish + Angular Material
- Test end-to-end (Cypress)
- Deploy e pipeline di release
