import { Injectable } from '@nestjs/common';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  topics: {
    orders: string;
    orderEvents: string;
  };
  retry: {
    initialRetryTime: number;
    retries: number;
  };
}

export interface KafkaSaslConfig {
  username?: string;
  password?: string;
  mechanism?: 'plain' | 'scram-sha-256' | 'scram-sha-512';
}

export interface KafkaSecurityConfig {
  ssl: boolean;
  sasl?: KafkaSaslConfig;
}

@Injectable()
export class KafkaConfigurationService {
  private readonly config: KafkaConfig;
  private readonly securityConfig: KafkaSecurityConfig;

  constructor() {
    this.config = this.buildKafkaConfig();
    this.securityConfig = this.buildSecurityConfig();
  }

  private buildKafkaConfig(): KafkaConfig {
    const brokersEnv = process.env.KAFKA_BROKERS || 'localhost:9092';
    const brokers = brokersEnv.split(',').map(b => b.trim());

    return {
      clientId: process.env.KAFKA_CLIENT_ID || 'order-stream-api',
      brokers,
      groupId: process.env.KAFKA_GROUP_ID || 'order-stream-consumer-group',
      topics: {
        orders: process.env.KAFKA_TOPIC_ORDERS || 'orders',
        orderEvents: process.env.KAFKA_TOPIC_ORDER_EVENTS || 'order-events',
      },
      retry: {
        initialRetryTime: parseInt(process.env.KAFKA_RETRY_INITIAL_TIME || '100', 10),
        retries: parseInt(process.env.KAFKA_RETRY_RETRIES || '8', 10),
      },
    };
  }

  private buildSecurityConfig(): KafkaSecurityConfig {
    const sslEnabled = process.env.KAFKA_SSL_ENABLED === 'true';
    
    if (!sslEnabled) {
      return { ssl: false };
    }

    return {
      ssl: true,
      sasl: process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD
        ? {
            username: process.env.KAFKA_SASL_USERNAME,
            password: process.env.KAFKA_SASL_PASSWORD,
            mechanism: (process.env.KAFKA_SASL_MECHANISM as any) || 'plain',
          }
        : undefined,
    };
  }

  getClientId(): string {
    return this.config.clientId;
  }

  getBrokers(): string[] {
    return this.config.brokers;
  }

  getGroupId(): string {
    return this.config.groupId;
  }

  getTopics(): KafkaConfig['topics'] {
    return this.config.topics;
  }

  getRetryConfig(): KafkaConfig['retry'] {
    return this.config.retry;
  }

  getSecurityConfig(): KafkaSecurityConfig {
    return this.securityConfig;
  }

  getKafkaConfig(): { 
    client: { 
      clientId: string; 
      brokers: string[]; 
    }; 
    consumer: { 
      groupId: string; 
    }; 
    ssl?: boolean; 
    sasl?: KafkaSaslConfig; 
  } {
    return {
      client: {
        clientId: this.config.clientId,
        brokers: this.config.brokers,
      },
      consumer: {
        groupId: this.config.groupId,
      },
      ssl: this.securityConfig.ssl,
      sasl: this.securityConfig.sasl,
    };
  }

  isConfigured(): boolean {
    return this.config.brokers.length > 0;
  }
}