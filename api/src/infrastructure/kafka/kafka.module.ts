import { Module, Global, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConfig } from '../../config/kafka.config';

@Global()
@Module({
  providers: [
    KafkaConfig,
    KafkaProducerService,
  ],
  exports: [
    KafkaProducerService,
  ],
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaModule.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  async onModuleInit() {
    this.logger.log('Inicializando módulo de Kafka');
    await this.kafkaProducerService.connect();
    this.logger.log('Productor de Kafka conectado exitosamente');
  }

  async onModuleDestroy() {
    this.logger.log('Cerrando conexiones de Kafka');
    await this.kafkaProducerService.disconnect();
    this.logger.log('Conexiones de Kafka cerradas');
  }
}