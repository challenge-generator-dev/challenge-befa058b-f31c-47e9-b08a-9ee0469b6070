export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsEndpoint: 'http://localhost:3000',
  sseEndpoint: 'http://localhost:3000/orders/stream',
  kafkaConfig: {
    brokers: ['localhost:9092'],
    topic: 'orders-events',
    groupId: 'ecommerce-client-group',
    clientId: 'ecommerce-client'
  },
  features: {
    enableRealTimeUpdates: true,
    enableOrderTracking: true,
    enableNotifications: true,
    enableAnalytics: false
  },
  limits: {
    maxOrdersPerPage: 50,
    maxConcurrentRequests: 5,
    reconnectInterval: 3000,
    heartbeatInterval: 30000
  },
  timeouts: {
    httpRequest: 30000,
    sseConnection: 60000,
    reconnectAttempts: 10
  },
  cache: {
    enableLocalCache: true,
    cacheTTL: 300000,
    maxCacheSize: 100
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false
  }
};