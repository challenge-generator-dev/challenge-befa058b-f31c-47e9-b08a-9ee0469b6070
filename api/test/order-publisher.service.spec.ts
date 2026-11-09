import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import { OrderPublisherService } from '../src/application/services/order-publisher.service';
import { KafkaConfigurationService } from '../src/config/kafka.config';
import { Order, OrderStatus, OrderEventType } from '../src/domain/order.model';

describe('OrderPublisherService', () => {
  let service: OrderPublisherService;
  let kafkaProducerMock: any;
  let kafkaConfigMock: any;

  const mockKafkaConfig = {
    client: {
      clientId: 'test-client',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'test-group',
    },
    topics: {
      orders: 'orders',
      orderEvents: 'order-events',
    },
  };

  beforeEach(async () => {
    kafkaProducerMock = {
      connect: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      isConnected: jest.fn().mockReturnValue(true),
    };

    const mockKafka = {
      producer: jest.fn().mockReturnValue(kafkaProducerMock),
    };

    jest.spyOn(Kafka, 'prototype', 'constructor').mockImplementation(() => mockKafka as any);
    jest.spyOn(Kafka, 'prototype', 'producer').mockReturnValue(kafkaProducerMock as any);

    kafkaConfigMock = {
      getKafkaConfig: jest.fn().mockReturnValue(mockKafkaConfig),
      getTopics: jest.fn().mockReturnValue(mockKafkaConfig.topics),
      isConfigured: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderPublisherService,
        {
          provide: KafkaConfigurationService,
          useValue: kafkaConfigMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                KAFKA_BROKERS: 'localhost:9092',
                KAFKA_CLIENT_ID: 'test-client',
                KAFKA_TOPIC_ORDER_EVENTS: 'order-events',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OrderPublisherService>(OrderPublisherService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('publish', () => {
    it('debería publicar un evento de orden en Kafka', async () => {
      const order = new Order(
        'order-123',
        'product-456',
        5,
        'customer-789',
        OrderStatus.PENDING
      );

      await service.publish(order);

      expect(kafkaProducerMock.connect).toHaveBeenCalled();
      expect(kafkaProducerMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-events',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: order.id,
              value: expect.any(String),
            }),
          ]),
        })
      );
    });

    it('debería incluir los datos correctos del evento en el mensaje', async () => {
      const order = new Order(
        'order-456',
        'product-abc',
        10,
        'customer-xyz',
        OrderStatus.CONFIRMED
      );

      let sentMessage: any;
      kafkaProducerMock.send.mockImplementation((params: any) => {
        sentMessage = params.messages[0];
        return Promise.resolve();
      });

      await service.publish(order);

      const messageValue = JSON.parse(sentMessage.value);
      expect(messageValue.orderId).toBe(order.id);
      expect(messageValue.productId).toBe(order.productId);
      expect(messageValue.quantity).toBe(order.quantity);
      expect(messageValue.customerId).toBe(order.customerId);
      expect(messageValue.status).toBe(OrderStatus.CONFIRMED);
      expect(messageValue.eventType).toBeDefined();
    });

    it('debería usar el ID de la orden como clave del mensaje para particionado', async () => {
      const order = new Order(
        'order-partition-key',
        'product-1',
        1,
        'customer-1',
        OrderStatus.PENDING
      );

      let sentMessage: any;
      kafkaProducerMock.send.mockImplementation((params: any) => {
        sentMessage = params.messages[0];
        return Promise.resolve();
      });

      await service.publish(order);

      expect(sentMessage.key).toBe(order.id);
    });

    it('debería rechazar si la orden es null', async () => {
      await expect(service.publish(null as any)).rejects.toThrow();
    });

    it('debería rechazar si la orden es undefined', async () => {
      await expect(service.publish(undefined as any)).rejects.toThrow();
    });
  });

  describe('publishStatusChange', () => {
    it('debería publicar un evento de cambio de estado', async () => {
      const order = new Order(
        'order-status-change',
        'product-1',
        2,
        'customer-1',
        OrderStatus.PENDING
      );

      order.updateStatus(OrderStatus.SHIPPED);

      await service.publishStatusChange(order, OrderStatus.PENDING, OrderStatus.SHIPPED);

      expect(kafkaProducerMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'order-events',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: order.id,
            }),
          ]),
        })
      );
    });
  });

  describe('onModuleInit', () => {
    it('debería conectar el producer al inicializar', async () => {
      await service.onModuleInit();
      expect(kafkaProducerMock.connect).toHaveBeenCalled();
    });

    it('debería manejar errores de conexión gracefully', async () => {
      kafkaProducerMock.connect.mockRejectedValue(new Error('Connection failed'));
      
      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
    });
  });

  describe('onModuleDestroy', () => {
    it('debería desconectar el producer al destruir', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();
      
      expect(kafkaProducerMock.disconnect).toHaveBeenCalled();
    });
  });

  describe('isConnected', () => {
    it('debería retornar true cuando el producer está conectado', async () => {
      await service.onModuleInit();
      expect(service.isConnected()).toBe(true);
    });

    it('debería retornar false cuando el producer no está conectado', () => {
      expect(service.isConnected()).toBe(false);
    });
  });
});