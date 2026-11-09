import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload, KafkaMessage } from 'kafkajs';
import { Observable, Subject, filter } from 'rxjs';
import { OrderEvent, OrderEventType, OrderEventPublisher } from '../../domain/order.model';
import { KafkaConfigurationService } from '../../config/kafka.config';
import { ORDER_EVENT_PUBLISHER } from '../../domain/constants';

export interface KafkaConsumerOptions {
  topic: string;
  fromBeginning?: boolean;
}

export interface KafkaMessageHandler {
  (message: KafkaMessage, partition: number, topic: string): Promise<void>;
}

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer | null = null;
  private isRunning = false;
  private messageSubject = new Subject<OrderEvent>();
  private readonly subscribedTopics = new Set<string>();

  constructor(
    private readonly kafkaConfig: KafkaConfigurationService,
  ) {
    this.kafka = new Kafka(this.kafkaConfig.getKafkaConfig().client);
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando servicio de consumidor Kafka');
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Deteniendo servicio de consumidor Kafka');
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const config = this.kafkaConfig.getKafkaConfig();
      
      this.consumer = this.kafka.consumer({
        groupId: config.consumer.groupId,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
      });

      await this.consumer.connect();
      this.logger.log('Conexión con Kafka establecida correctamente');
    } catch (error) {
      this.logger.error('Error al conectar con Kafka', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.consumer && this.isRunning) {
      await this.consumer.disconnect();
      this.isRunning = false;
      this.logger.log('Desconexión de Kafka completada');
    }
  }

  async subscribe(options: KafkaConsumerOptions): Promise<void> {
    if (!this.consumer) {
      throw new Error('Consumer no inicializado. Llame a connect() primero.');
    }

    const { topic, fromBeginning = false } = options;

    if (this.subscribedTopics.has(topic)) {
      this.logger.warn(`Ya suscrito al topic: ${topic}`);
      return;
    }

    await this.consumer.subscribe({ topic, fromBeginning });
    this.subscribedTopics.add(topic);
    this.logger.log(`Suscrito al topic: ${topic}`);
  }

  async startConsuming(handler?: KafkaMessageHandler): Promise<void> {
    if (!this.consumer) {
      throw new Error('Consumer no inicializado. Llame a connect() primero.');
    }

    if (this.subscribedTopics.size === 0) {
      this.logger.warn('No hay topics suscritos. Use subscribe() primero.');
      return;
    }

    this.isRunning = true;
    const topics = Array.from(this.subscribedTopics);
    this.logger.log(`Iniciando consumo de topics: ${topics.join(', ')}`);

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          const { topic, partition, message } = payload;
          
          if (!message.value) {
            this.logger.warn(`Mensaje sin valor en ${topic}:${partition}`);
            return;
          }

          const orderEvent = this.parseMessage(message);
          
          if (orderEvent) {
            this.messageSubject.next(orderEvent);
            
            if (handler) {
              await handler(message, partition, topic);
            }
            
            this.logger.debug(
              `Procesado evento: ${orderEvent.eventType} - Order: ${orderEvent.orderId}`
            );
          }
        } catch (error) {
          this.logger.error('Error al procesar mensaje', error);
        }
      },
    });
  }

  private parseMessage(message: KafkaMessage): OrderEvent | null {
    try {
      const value = message.value?.toString();
      if (!value) return null;

      const data = JSON.parse(value);
      
      return new OrderEvent(
        data.orderId,
        data.eventType as OrderEventType,
        data.status,
        data.timestamp ? new Date(data.timestamp) : new Date(),
        data.productId,
        data.quantity,
        data.customerId,
      );
    } catch (error) {
      this.logger.error('Error al parsear mensaje de Kafka', error);
      return null;
    }
  }

  getEventStream(): Observable<OrderEvent> {
    return this.messageSubject.asObservable();
  }

  getEventsByType(eventType: OrderEventType): Observable<OrderEvent> {
    return this.messageSubject.pipe(
      filter(event => event.eventType === eventType)
    );
  }

  getEventsByOrderId(orderId: string): Observable<OrderEvent> {
    return this.messageSubject.pipe(
      filter(event => event.orderId === orderId)
    );
  }

  async pause(): Promise<void> {
    if (this.consumer && this.isRunning) {
      await this.consumer.pause([...this.subscribedTopics].map(topic => ({ topic })));
      this.logger.log('Consumo de Kafka pausado');
    }
  }

  async resume(): Promise<void> {
    if (this.consumer && this.isRunning) {
      await this.consumer.resume([...this.subscribedTopics].map(topic => ({ topic })));
      this.logger.log('Consumo de Kafka reanudado');
    }
  }

  isConnected(): boolean {
    return this.consumer !== null && this.isRunning;
  }

  getSubscribedTopics(): string[] {
    return Array.from(this.subscribedTopics);
  }
}