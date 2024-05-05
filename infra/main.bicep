@description('Name of the storage account.')
param storageName string = 'stg${uniqueString(resourceGroup().id)}'

@description('Name of the function app.')
param functionName string = 'fn${uniqueString(resourceGroup().id)}api'

@description('Name of the function app plan name.')
param appPlanName string = 'plan${uniqueString(resourceGroup().id)}api'

@description('Location of the resource.')
param location string = resourceGroup().location

@description('Name of the log analytics workspace.')
param logAnalyticsWorkspaceName string = 'law${uniqueString(resourceGroup().id)}'

@description('Name of the application insights.')
param appInsightName string = 'ai${uniqueString(resourceGroup().id)}'

@description('Name of the static app.')
param staticAppName string = 'ui${uniqueString(resourceGroup().id)}web'

@description('Location of the static app.')
param staticWebAppLocation string = 'eastasia'

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-05-01' = {
  name: storageName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    defaultToOAuthAuthentication: true
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2021-09-01' existing = {
  name: 'default'
  parent: storageAccount
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2021-09-01' existing = {
  name: 'default'
  parent: storageAccount
}

resource table 'Microsoft.Storage/storageAccounts/tableServices/tables@2021-09-01' = {
  name: 'urls'
  parent: tableService
}

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2020-10-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    sku: {
      name: 'pergb2018'
    }
  }
}

resource storageDataPlaneLogs 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${storageName}-logs'
  scope: blobService
  properties: {
    workspaceId: logAnalyticsWorkspace.id
    logs: [
      {
        category: 'StorageWrite'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: appInsightName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'IbizaWebAppExtensionCreate'
    Flow_Type: 'Redfield'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2020-12-01' = {
  name: appPlanName
  location: location
  kind: 'linux'
  sku: {
    tier: 'Dynamic'
    name: 'Y1'
  }
  properties: {
    reserved: true
  }
}

resource functionApp 'Microsoft.Web/sites@2020-12-01' = {
  name: functionName
  location: location
  kind: 'functionapp,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'Node|20'
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'AZURE_LOG_ANALYTICS_WORKSPACE_ID'
          value: logAnalyticsWorkspace.id
        }
        {
          name: 'TABLE_NAME'
          value: 'urls'
        }
      ]
    }
  }
}

resource staticApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticAppName
  location: staticWebAppLocation
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    provider: 'Custom'
  }
}
