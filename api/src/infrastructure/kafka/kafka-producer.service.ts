import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { KafkaConfig } from '../../config/kafka.config';
import { OrderEventPublisher } from '../../domain/order.model';
import { OrderEvent } from '../../domain/order.model';

@Injectable()
export class KafkaProducerService implements OrderEventPublisher, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private producer: Producer;
  private readonly topic = 'orders-events';
  private isConnected = false;

  constructor(private readonly kafkaConfig: KafkaConfig) {
    const kafka = new Kafka({
      clientId: this.kafkaConfig.getClientId(),
      brokers: this.kafkaConfig.getBrokers(),
      ssl: this.kafkaConfig.getSslOptions(),
      sasl: this.kafkaConfig.getSaslOptions(),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('El productor de Kafka ya está conectado');
      return;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log('Conectado al broker de Kafka');
    } catch (error) {
      this.logger.error('Error al conectar con Kafka', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      this.logger.log('Desconectado del broker de Kafka');
    } catch (error) {
      this.logger.error('Error al desconectar de Kafka', error);
      throw error;
    }
  }

  async publish(event: OrderEvent): Promise<void> {
    if (!this.isConnected) {
      this.logger.error('No se puede publicar: el productor no está conectado');
      throw new Error('Kafka producer not connected');
    }

    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            eventId: event.eventId,
            orderId: event.orderId,
            eventType: event.eventType,
            timestamp: event.timestamp,
            payload: event.payload,
          }),
          headers: {
            'content-type': 'application/json',
            'event-type': event.eventType,
          },
        },
      ],
    };

    try {
      await this.producer.send(record);
      this.logger.debug(`Evento publicado: ${event.eventType} para orden ${event.orderId}`);
    } catch (error) {
      this.logger.error(`Error al publicar evento ${event.eventType}`, error);
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}