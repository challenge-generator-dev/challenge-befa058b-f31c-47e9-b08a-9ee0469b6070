import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuración del microservicio Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
        clientId: configService.get<string>('KAFKA_CLIENT_ID', 'order-service'),
      },
      consumer: {
        groupId: configService.get<string>('KAFKA_CONSUMER_GROUP', 'order-consumer-group'),
      },
    },
  });

  await app.startAllMicroservices();
  logger.log('Microservicio Kafka conectado');

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Servidor HTTP escuchando en el puerto ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error durante el arranque de la aplicación:', err);
  process.exit(1);
});