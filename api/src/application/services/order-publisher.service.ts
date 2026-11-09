import { Injectable, Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { Order, OrderEvent, OrderEventType, OrderStatus, OrderEventPublisher } from '../../domain/order.model';
import { CreateOrderDto } from '../../common/dto/order-event.dto';

@Injectable()
export class OrderPublisherService implements OrderEventPublisher, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderPublisherService.name);
  private kafka: Kafka;
  private producer: Producer;
  private readonly topicName: string;
  private readonly orderEventsTopic: string;

  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaProducer: KafkaProducerService,
    private readonly configService: ConfigService,
  ) {
    this.topicName = this.configService.get<string>('KAFKA_TOPIC_ORDERS', 'orders-events');
    this.orderEventsTopic = this.configService.get<string>('KAFKA_TOPIC_ORDER_EVENTS', 'order-events');
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando OrderPublisherService');
    
    const clientId = this.configService.get<string>('KAFKA_CLIENT_ID', 'order-stream-api');
    const brokers = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');
    
    this.kafka = new Kafka({
      clientId,
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
    });

    try {
      await this.producer.connect();
      this.logger.log('Productor de Kafka conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar el productor de Kafka', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Desconectando OrderPublisherService');
    
    if (this.producer) {
      await this.producer.disconnect();
      this.logger.log('Productor de Kafka desconectado');
    }
  }

  async publish(event: OrderEvent): Promise<void> {
    const eventPayload = {
      eventId: event.eventId,
      orderId: event.orderId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      payload: event.payload,
      metadata: {
        version: '1.0',
        service: 'order-stream-api',
      },
    };

    try {
      await this.producer.send({
        topic: this.orderEventsTopic,
        messages: [
          {
            key: event.orderId,
            value: JSON.stringify(eventPayload),
            headers: {
              'event-type': event.eventType,
              'content-type': 'application/json',
            },
          },
        ],
        acks: 'all',
        timeout: 30000,
      });

      this.logger.log(`Evento ${event.eventType} publicado para orden ${event.orderId}`);
    } catch (error) {
      this.logger.error(`Error al publicar evento para orden ${event.orderId}`, error);
      throw error;
    }
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderId = this.generateOrderId();
    const now = new Date();

    const order = new Order(
      orderId,
      createOrderDto.productId,
      createOrderDto.quantity,
      createOrderDto.customerId,
      OrderStatus.PENDING,
      now,
      now,
    );

    const orderCreatedEvent = order.toEvent(OrderEventType.ORDER_CREATED);
    await this.publish(orderCreatedEvent);

    this.logger.log(`Orden ${orderId} creada y evento publicado`);
    return order;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<OrderEvent> {
    const order = await this.getOrderById(orderId);
    
    if (!order) {
      throw new Error(`Orden ${orderId} no encontrada`);
    }

    const previousStatus = order.status;
    order.updateStatus(newStatus);

    const statusChangedEvent = order.toEvent(OrderEventType.ORDER_STATUS_CHANGED);
    (statusChangedEvent as any).previousStatus = previousStatus;
    
    await this.publish(statusChangedEvent);

    this.logger.log(`Estado de orden ${orderId} actualizado de ${previousStatus} a ${newStatus}`);
    return statusChangedEvent;
  }

  async cancelOrder(orderId: string, reason?: string): Promise<OrderEvent> {
    const order = await this.getOrderById(orderId);
    
    if (!order) {
      throw new Error(`Orden ${orderId} no encontrada`);
    }

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new Error(`No se puede cancelar una orden en estado ${order.status}`);
    }

    order.updateStatus(OrderStatus.CANCELLED);

    const cancelledEvent = order.toEvent(OrderEventType.ORDER_CANCELLED);
    (cancelledEvent as any).cancellationReason = reason || 'Cancelada por el cliente';
    
    await this.publish(cancelledEvent);

    this.logger.log(`Orden ${orderId} cancelada${reason ? `: ${reason}` : ''}`);
    return cancelledEvent;
  }

  private generateOrderId(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    return `ORD-${timestamp}-${randomSuffix}`.toUpperCase();
  }

  private async getOrderById(orderId: string): Promise<Order | null> {
    this.logger.debug(`Buscando orden ${orderId}`);
    return null;
  }

  async getProducer(): Promise<Producer> {
    return this.producer;
  }

  getTopicName(): string {
    return this.orderEventsTopic;
  }
}