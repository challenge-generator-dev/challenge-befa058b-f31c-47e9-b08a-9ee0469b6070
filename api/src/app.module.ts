import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderPublisherService } from './application/services/order-publisher.service';
import { OrderController } from './infrastructure/controllers/order.controller';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { KafkaProducerService } from './infrastructure/kafka/kafka-producer.service';
import { KafkaConfig } from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const kafkaConfig: KafkaConfig = {
          clientId: configService.get<string>('KAFKA_CLIENT_ID', 'order-stream-api'),
          brokers: configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
          ssl: configService.get<boolean>('KAFKA_SSL', false),
          sasl: configService.get<boolean>('KAFKA_SASL', false)
            ? {
                mechanism: configService.get<string>('KAFKA_SASL_MECHANISM', 'plain'),
                username: configService.get<string>('KAFKA_SASL_USERNAME', ''),
                password: configService.get<string>('KAFKA_SASL_PASSWORD', ''),
              }
            : undefined,
        };
        return kafkaConfig;
      },
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderPublisherService,
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: (kafkaProducerService: KafkaProducerService) => kafkaProducerService,
      inject: [KafkaProducerService],
    },
  ],
  exports: [OrderPublisherService],
})
export class AppModule {}