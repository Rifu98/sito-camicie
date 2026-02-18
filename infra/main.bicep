@description('Name prefix')
param prefix string = 'sitoCamicie'
param location string = resourceGroup().location

var postgresName = '${prefix}pg'
var appServicePlan = '${prefix}-plan'
var webappName = '${prefix}-web'

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2024-01-01' = {
  name: postgresName
  location: location
  properties: {
    administratorLogin: 'postgres'
    administratorLoginPassword: 'ChangeMe123!'
    version: '15'
    storage: { storageSizeGb: 32 }
  }
  sku: { name: 'Standard_B1ms' }
}

resource plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlan
  location: location
  sku: { name: 'P1v2'; capacity: 1 }
}

resource web 'Microsoft.Web/sites@2022-03-01' = {
  name: webappName
  location: location
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|ghcr.io/YOUR_ORG/sito-camicie-backend:latest'
      appSettings: [
        { name: 'SPRING_DATASOURCE_URL'; value: 'jdbc:postgresql://${postgres.name}.postgres.database.azure.com:5432/sito_camicie' }
        { name: 'SPRING_DATASOURCE_USERNAME'; value: 'postgres@${postgres.name}' }
        { name: 'SPRING_DATASOURCE_PASSWORD'; value: 'ChangeMe123!' }
      ]
    }
  }
  dependsOn: [plan, postgres]
}

output webUrl string = web.properties.defaultHostName
