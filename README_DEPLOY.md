# Deploy guide (Azure App Service + Azure Database for PostgreSQL)

Steps to provision resources and deploy the app (Bicep + GitHub Actions):

1) Prerequisites
   - az cli installed and logged in
   - an Azure subscription

2) Create resources (example using az cli)
   - az group create -n sito-camicie-rg -l westeurope
   - az deployment group create -g sito-camicie-rg --template-file infra/main.bicep

3) Build & push images (GitHub Actions set up in `.github/workflows/docker-publish.yml`)

4) Configure App Service to use the images from GHCR or deploy jar and static files

5) Connection strings: set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` as app settings

---

I can generate `infra/main.bicep` and a GitHub Actions deployment workflow if vuoi che proceda.
