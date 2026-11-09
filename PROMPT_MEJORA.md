# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/stream`
  - `POST /orders`

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/infrastructure/kafka/kafka-producer.service.ts` — `KafkaConfig.getSslOptions`: Se invoca `getSslOptions` sobre `KafkaConfig`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/kafka/kafka-producer.service.ts` — `KafkaConfig.getSaslOptions`: Se invoca `getSaslOptions` sobre `KafkaConfig`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/controllers/order.controller.ts` — `OrderPublisherService.subscribeToOrderEvents`: Se invoca `subscribeToOrderEvents` sobre `OrderPublisherService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-publisher.service.spec.ts` — `OrderPublisherService.publishStatusChange`: Se invoca `publishStatusChange` sobre `OrderPublisherService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-publisher.service.spec.ts` — `OrderPublisherService.isConnected`: Se invoca `isConnected` sobre `OrderPublisherService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/app/shared/components/order-status/order-status.component.ts` — `OrderStatusType.includes`: Se invoca `includes` sobre `OrderStatusType`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/app/features/auth/login/login.component.ts` — `ValidationError.push`: Se invoca `push` sobre `ValidationError`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/app/features/auth/login/login.component.ts` — `ValidationError.filter`: Se invoca `filter` sobre `ValidationError`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261109083811938), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Integración de Kafka para visualización de órdenes en tiempo real
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial de Kafka — objetivo: Configurar un entorno de Kafka para publicar y consumir eventos. — entregable (NO resolver): Entorno de Kafka configurado con topic y conexiones establecidas.
- Fase 2: Publicación de eventos de órdenes — objetivo: Implementar la publicación de eventos de nuevas órdenes en el topic de Kafka. — entregable (NO resolver): Servicio que publica eventos de nuevas órdenes en el topic de Kafka.
- Fase 3: Consumo y visualización de eventos — objetivo: Implementar la consumición de eventos de Kafka y su visualización en tiempo real en la interfaz de usuario. — entregable (NO resolver): Consumidor que actualiza la interfaz de usuario con eventos de Kafka en tiempo real.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-stream-api",
  "version": "1.0.0",
  "description": "API para publicación y consumo de eventos de órdenes en tiempo real usando Kafka",
  "main": "dist/main.js",
  "scripts": {
    "build": "rimraf dist && tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "prisma:generate": "prisma generate"
  },
  "dependencies": {
    "@nestjs/common": "^11.2.9",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.2.9",
    "@nestjs/microservices": "^11.2.9",
    "@nestjs/platform-express": "^11.2.9",
    "class-validator": "^0.14.1",
    "kafkajs": "^2.2.4",
    "reflect-metadata": "^0.2.2",
    "rimraf": "^6.0.1",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1",
    "@nestjs/event-emitter": "2.0.4"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.2.9",
    "@types/express": "^5.0.0",
    "@types/node": "^22.7.4",
    "@types/uuid": "^9.0.8",
    "jest": "^29.7.0",
    "prettier": "^3.3.3",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
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

// === ARCHIVO: api/src/domain/order.model.ts ===
import { v4 as uuidv4 } from 'uuid';

/**
 * Eventos de dominio para órdenes
 */
export enum OrderEventType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED'
}

/**
 * Estado de una orden
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Evento de dominio para órdenes
 */
export class OrderEvent {
  constructor(
    public readonly eventId: string,
    public readonly eventType: OrderEventType,
    public readonly orderId: string,
    public readonly payload: any,
    public readonly timestamp: Date
  ) {}
}

/**
 * Modelo de dominio para una orden
 */
export class Order {
  constructor(
    public readonly id: string = uuidv4(),
    public readonly productId: string,
    public readonly quantity: number,
    public readonly customerId: string,
    public status: OrderStatus = OrderStatus.PENDING,
    public readonly createdAt: Date = new Date()
  ) {}

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  toEvent(eventType: OrderEventType): OrderEvent {
    return new OrderEvent(
      uuidv4(),
      eventType,
      this.id,
      {
        productId: this.productId,
        quantity: this.quantity,
        customerId: this.customerId,
        status: this.status
      },
      new Date()
    );
  }
}

/**
 * Puerto para publicar eventos de órdenes
 */
export interface OrderEventPublisher {
  publish(event: OrderEvent): Promise<void>;
}

/**
 * Puerto para obtener un stream de eventos de órdenes
 */
export interface OrderEventStream {
  getStream(): Promise<NodeJS.ReadableStream>;
}

// === ARCHIVO: api/src/common/dto/order-event.dto.ts ===
import { IsDateString, IsEnum, IsObject, IsString, IsUUID } from 'class-validator';
import { OrderEventType } from '../../domain/order.model';

/**
 * DTO para eventos de órdenes
 */
export class OrderEventDto {
  @IsUUID()
  eventId: string;

  @IsEnum(OrderEventType)
  eventType: OrderEventType;

  @IsUUID()
  orderId: string;

  @IsObject()
  payload: {
    productId: string;
    quantity: number;
    customerId: string;
    status: string;
  };

  @IsDateString()
  timestamp: Date;

  constructor(
    eventId: string,
    eventType: OrderEventType,
    orderId: string,
    payload: {
      productId: string;
      quantity: number;
      customerId: string;
      status: string;
    },
    timestamp: Date
  ) {
    this.eventId = eventId;
    this.eventType = eventType;
    this.orderId = orderId;
    this.payload = payload;
    this.timestamp = timestamp;
  }
}

/**
 * DTO para creación de órdenes
 */
export class CreateOrderDto {
  @IsString()
  productId: string;

  @IsString()
  customerId: string;

  @IsString()
  quantity: number;
}

// === ARCHIVO: api/src/app.module.ts ===
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

// === ARCHIVO: api/src/application/services/order-publisher.service.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/kafka.module.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/kafka-producer.service.ts ===
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

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  Logger,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { OrderPublisherService } from '../../application/services/order-publisher.service';
import { CreateOrderDto } from '../../common/dto/order-event.dto';
import { Order, OrderStatus, OrderEventType } from '../../domain/order.model';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  private readonly activeStreams: Map<string, Response> = new Map();

  constructor(private readonly orderPublisherService: OrderPublisherService) {}

  @Get('stream')
  async getOrdersStream(
    @Headers() headers: Record<string, string>,
    @Res() res: Response,
  ) {
    const accept = headers['accept'] || '';
    
    if (!accept.includes('text/event-stream')) {
      throw new UnauthorizedException(
        'Se requiere Accept: text/event-stream para acceder al stream de eventos',
      );
    }

    const streamId = `stream-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    res.writeHead(HttpStatus.OK, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    this.activeStreams.set(streamId, res);
    this.logger.log(`Cliente SSE conectado: ${streamId}`);

    const welcomeEvent = {
      type: 'connection',
      message: 'Conectado al stream de órdenes',
      streamId,
      timestamp: new Date().toISOString(),
    };
    res.write(`data: ${JSON.stringify(welcomeEvent)}\n\n`);

    const heartbeatInterval = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(heartbeatInterval);
        return;
      }
      const heartbeat = {
        type: 'heartbeat',
        timestamp: new Date().toISOString(),
      };
      res.write(`data: ${JSON.stringify(heartbeat)}\n\n`);
    }, 30000);

    res.on('close', () => {
      clearInterval(heartbeatInterval);
      this.activeStreams.delete(streamId);
      this.logger.log(`Cliente SSE desconectado: ${streamId}`);
    });

    this.orderPublisherService.subscribeToOrderEvents((event) => {
      if (!res.writableEnded) {
        const sseEvent = {
          type: 'order_event',
          data: event,
          timestamp: new Date().toISOString(),
        };
        res.write(`data: ${JSON.stringify(sseEvent)}\n\n`);
      }
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    this.logger.log(`Creando orden para producto: ${createOrderDto.productId}`);

    const order = new Order(
      `order-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      createOrderDto.productId,
      createOrderDto.quantity,
      createOrderDto.customerId,
      OrderStatus.PENDING,
      new Date(),
    );

    const createdOrder = await this.orderPublisherService.createOrder(order);
    
    this.broadcastToAllStreams({
      type: 'order_created',
      data: createdOrder.toEvent(OrderEventType.ORDER_CREATED),
      timestamp: new Date().toISOString(),
    });

    return createdOrder;
  }

  private broadcastToAllStreams(event: unknown): void {
    for (const [, res] of this.activeStreams) {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    }
  }
}

// === ARCHIVO: api/src/config/kafka.config.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/kafka-consumer.service.ts ===
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

// === ARCHIVO: api/test/order-publisher.service.spec.ts ===
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

// === ARCHIVO: api/src/domain/constants.ts ===
export const ORDER_EVENT_PUBLISHER = 'ORDER_EVENT_PUBLISHER';

// === ARCHIVO: client/package.json ===
{
  "name": "ecommerce-orders-client",
  "version": "0.0.1",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~20.2.0",
    "@angular/cdk": "~20.2.0",
    "@angular/common": "~20.2.0",
    "@angular/compiler": "~20.2.0",
    "@angular/core": "~20.2.0",
    "@angular/forms": "~20.2.0",
    "@angular/material": "~20.2.0",
    "@angular/platform-browser": "~20.2.0",
    "@angular/platform-browser-dynamic": "~20.2.0",
    "@angular/router": "~20.2.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.6.2",
    "zone.js": "~0.14.4",
    "@ngrx/effects": "19.0.0",
    "@ngrx/store": "19.0.0",
    "@ngrx/store-devtools": "19.0.0"
  },
  "devDependencies": {
    "@angular-builders/jest": "~20.0.0",
    "@angular-devkit/build-angular": "~20.2.0",
    "@angular/cli": "~20.2.0",
    "@angular/compiler-cli": "~20.2.0",
    "@types/jest": "~29.5.12",
    "jest": "~29.7.0",
    "jest-preset-angular": "~14.0.3",
    "typescript": "~5.8.2"
  }
}


// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "ecommerce-orders-client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "standalone": true,
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/ecommerce-orders-client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": true,
              "extractLicenses": false,
              "vendorChunk": true,
              "buildOptimizer": false
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "development": {
              "browserTarget": "ecommerce-orders-client:build:development"
            },
            "production": {
              "browserTarget": "ecommerce-orders-client:build:production"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "ecommerce-orders-client:build"
          }
        },
        "test": {
          "builder": "@angular-builders/jest:run",
          "options": {
            "configPath": "jest.config.js",
            "tsConfig": "tsconfig.spec.json",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ]
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "tsconfig.app.json",
              "tsconfig.spec.json"
            ],
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
  },
  "defaultProject": "ecommerce-orders-client",
  "cli": {
    "analytics": false
  }
}


// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "dom", "dom.iterable"]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

// === ARCHIVO: client/src/app/core/models/order.model.ts ===
import { OrderStatus } from '../types/order-status.type';

/**
 * Modelo de datos para órdenes en el frontend.
 * Representa la información de una orden recibida desde el backend.
 */
export interface Order {
  id: string;
  productId: string;
  quantity: number;
  customerId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Tipo para los eventos de órdenes recibidos por SSE.
 */
export interface OrderEvent {
  type: 'created' | 'updated' | 'cancelled';
  payload: Order;
}

// === ARCHIVO: client/src/app/core/services/order.service.ts ===
import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Order, OrderEvent } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSignal = signal<Order[]>([]);
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {
    this.setupOrderStream();
  }

  /**
   * Obtiene el estado reactivo de las órdenes.
   */
  get orders() {
    return this.ordersSignal.asReadonly();
  }

  /**
   * Crea una nueva orden.
   * @param orderData Datos de la orden a crear.
   */
  createOrder(orderData: { productId: string; quantity: number; customerId: string }): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, orderData).pipe(
      catchError(error => {
        console.error('Error creating order:', error);
        return throwError(() => new Error('Failed to create order'));
      })
    );
  }

  /**
   * Configura la conexión SSE para recibir eventos de órdenes en tiempo real.
   */
  private setupOrderStream(): void {
    this.eventSource = new EventSource(`${environment.apiUrl}/orders/stream`);

    this.eventSource.onmessage = (event) => {
      try {
        const orderEvent: OrderEvent = JSON.parse(event.data);
        this.handleOrderEvent(orderEvent);
      } catch (error) {
        console.error('Error parsing order event:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      this.reconnectOrderStream();
    };
  }

  /**
   * Maneja un evento de orden recibido por SSE.
   * @param event Evento de orden.
   */
  private handleOrderEvent(event: OrderEvent): void {
    const currentOrders = this.ordersSignal();
    switch (event.type) {
      case 'created':
        this.ordersSignal.set([...currentOrders, event.payload]);
        break;
      case 'updated':
        const updatedOrders = currentOrders.map(order =>
          order.id === event.payload.id ? event.payload : order
        );
        this.ordersSignal.set(updatedOrders);
        break;
      case 'cancelled':
        const filteredOrders = currentOrders.filter(order =>
          order.id !== event.payload.id
        );
        this.ordersSignal.set(filteredOrders);
        break;
    }
  }

  /**
   * Intenta reconectar el stream SSE después de un error.
   */
  private reconnectOrderStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
    setTimeout(() => {
      this.setupOrderStream();
    }, 3000);
  }

  /**
   * Limpia recursos al destruir el servicio.
   */
  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}

// === ARCHIVO: client/src/app/core/interceptors/error.interceptor.ts ===
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido';
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          errorMessage = `Código: ${error.status} - ${error.message}`;
        }
        
        // Mostrar notificación de error
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>ecommerce-orders-client</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Plataforma de comercio electrónico - Visualización de órdenes en tiempo real">
  <meta name="theme-color" content="#1976d2">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
  <noscript>
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript requerido</h1>
      <p>Por favor, habilite JavaScript en su navegador para utilizar esta aplicación.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/app.component.ts ===
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <mat-icon>shopping_cart</mat-icon>
          <span>Orders</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/orders" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt_long</mat-icon>
            <span matListItemTitle>Pedidos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      display: flex;
    }
    .sidenav {
      width: 240px;
      background: #1a1a2e;
      border-right: 1px solid #16213e;
    }
    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 1px solid #16213e;
    }
    .sidenav-header mat-icon {
      color: #e94560;
    }
    .toolbar {
      background: #1a1a2e;
      color: #fff;
      border-bottom: 1px solid #16213e;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 24px;
      background: #0f0f1a;
      min-height: calc(100vh - 64px);
    }
    .active {
      background: rgba(233, 69, 96, 0.15);
      border-left: 3px solid #e94560;
    }
  `]
})
export class AppComponent {
  sidenavOpened = true;

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptors([])
    ),
    provideAnimationsAsync(),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
};

// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

const authGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

const adminGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated() && authService.hasRole('admin')) {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};

const loggedOutGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/orders']);
  return false;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => 
      import('./features/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard],
    data: {
      title: 'Gestión de Pedidos',
      description: 'Visualización y gestión de pedidos en tiempo real',
      animation: 'OrdersPage'
    }
  },
  {
    path: 'orders/:id',
    loadComponent: () => 
      import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard],
    data: {
      title: 'Detalle del Pedido',
      description: 'Información detallada de un pedido específico',
      animation: 'OrderDetailPage'
    }
  },
  {
    path: 'analytics',
    loadComponent: () => 
      import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [adminGuard],
    data: {
      title: 'Análisis de Pedidos',
      description: 'Dashboard de análisis y métricas de pedidos',
      animation: 'AnalyticsPage'
    }
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [loggedOutGuard],
    data: {
      title: 'Iniciar Sesión',
      description: 'Autenticación de usuario',
      animation: 'LoginPage'
    }
  },
  {
    path: 'unauthorized',
    loadComponent: () => 
      import('./features/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    data: {
      title: 'Acceso Denegado',
      description: 'Página de acceso no autorizado',
      animation: 'UnauthorizedPage'
    }
  },
  {
    path: 'not-found',
    loadComponent: () => 
      import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: {
      title: 'Página No Encontrada',
      description: 'Recurso no encontrado',
      animation: 'NotFoundPage'
    }
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

// === ARCHIVO: client/src/app/features/orders/orders.component.ts ===
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../core/services/order.service';
import { OrderCardComponent } from '../../shared/components/order-card/order-card.component';
import { OrderStatusComponent } from '../../shared/components/order-status/order-status.component';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    OrderCardComponent,
    OrderStatusComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  
  readonly orders = this.orderService.orders;
  
  newOrder = {
    productId: '',
    quantity: 1,
    customerId: ''
  };
  
  isCreatingOrder = false;
  errorMessage = '';
  showError = false;
  
  ngOnInit(): void {
    this.orderService.setupOrderStream();
  }
  
  ngOnDestroy(): void {
    this.orderService.ngOnDestroy();
  }
  
  async createOrder(): Promise<void> {
    if (!this.validateOrderInput()) {
      return;
    }
    
    this.isCreatingOrder = true;
    this.hideError();
    
    try {
      await this.orderService.createOrder({
        productId: this.newOrder.productId,
        quantity: this.newOrder.quantity,
        customerId: this.newOrder.customerId
      });
      
      this.resetForm();
    } catch (error) {
      this.displayError('Error al crear la orden. Intente de nuevo.');
    } finally {
      this.isCreatingOrder = false;
    }
  }
  
  private validateOrderInput(): boolean {
    if (!this.newOrder.productId || this.newOrder.productId.trim() === '') {
      this.displayError('El ID del producto es requerido');
      return false;
    }
    
    if (!this.newOrder.customerId || this.newOrder.customerId.trim() === '') {
      this.displayError('El ID del cliente es requerido');
      return false;
    }
    
    if (this.newOrder.quantity < 1) {
      this.displayError('La cantidad debe ser mayor a 0');
      return false;
    }
    
    return true;
  }
  
  private resetForm(): void {
    this.newOrder = {
      productId: '',
      quantity: 1,
      customerId: ''
    };
  }
  
  private displayError(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }
  
  private hideError(): void {
    this.showError = false;
    this.errorMessage = '';
  }
  
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
  
  get ordersList(): Order[] {
    return this.orders();
  }
  
  get hasOrders(): boolean {
    return this.ordersList.length > 0;
  }
}

// === ARCHIVO: client/src/app/features/orders/orders.component.html ===
<div class="orders-container">
  <header class="orders-header">
    <h1 class="title">Pedidos en Tiempo Real</h1>
    <p class="subtitle">Visualiza y gestiona los pedidos de tu tienda</p>
  </header>

  <section class="create-order-section">
    <mat-card class="create-order-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>add_shopping_cart</mat-icon>
          Crear Nuevo Pedido
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form (ngSubmit)="createOrder()" class="order-form">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>ID del Producto</mat-label>
            <input 
              matInput 
              [(ngModel)]="newOrder.productId" 
              name="productId"
              placeholder="PROD-001"
              required
            />
            <mat-icon matPrefix>inventory_2</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>ID del Cliente</mat-label>
            <input 
              matInput 
              [(ngModel)]="newOrder.customerId" 
              name="customerId"
              placeholder="CUST-001"
              required
            />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Cantidad</mat-label>
            <input 
              matInput 
              type="number" 
              [(ngModel)]="newOrder.quantity" 
              name="quantity"
              min="1"
              required
            />
            <mat-icon matPrefix>numbers</mat-icon>
          </mat-form-field>
          
          <div class="form-actions">
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="isCreatingOrder"
              class="submit-button"
            >
              @if (isCreatingOrder) {
                <mat-spinner diameter="20"></mat-spinner>
                <span>Creando...</span>
              } @else {
                <mat-icon>add</mat-icon>
                <span>Crear Pedido</span>
              }
            </button>
          </div>
        </form>
        
        @if (showError) {
          <div class="error-message" role="alert">
            <mat-icon>error</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>
        }
      </mat-card-content>
    </mat-card>
  </section>

  <section class="orders-list-section">
    <div class="section-header">
      <h2 class="section-title">
        <mat-icon>receipt_long</mat-icon>
        Lista de Pedidos
        <span class="order-count">({{ ordersList.length }})</span>
      </h2>
    </div>
    
    @if (!hasOrders) {
      <div class="empty-state">
        <mat-icon>inbox</mat-icon>
        <p>No hay pedidos todavía</p>
        <span>Los pedidos aparecerán aquí en tiempo real</span>
      </div>
    } @else {
      <div class="orders-grid">
        @for (order of ordersList; track trackByOrderId($index, order)) {
          <app-order-card [order]="order" class="order-card-wrapper">
            <app-order-status [status]="order.status"></app-order-status>
          </app-order-card>
        }
      </div>
    }
  </section>
</div>

// === ARCHIVO: client/src/app/features/orders/orders.component.scss ===
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: #fafafa;
  min-height: 100vh;
}

.orders-header {
  margin-bottom: 2rem;
  text-align: center;

  .title {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
  }

  .subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }
}

.create-order-section {
  margin-bottom: 2.5rem;

  .create-order-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;

    mat-card-header {
      margin-bottom: 1.5rem;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.25rem;
        font-weight: 500;
        color: #333;

        mat-icon {
          color: #3f51b5;
        }
      }
    }
  }

  .order-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    align-items: start;
  }

  .form-field {
    width: 100%;
  }

  .form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    .submit-button {
      min-width: 180px;
      height: 48px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      mat-spinner {
        margin-right: 0.5rem;
      }
    }
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
    background-color: #ffebee;
    border: 1px solid #ef5350;
    border-radius: 8px;
    color: #c62828;
    animation: slideIn 0.3s ease-out;

    mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  }
}

.orders-list-section {
  .section-header {
    margin-bottom: 1.5rem;

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0;

      mat-icon {
        color: #3f51b5;
      }

      .order-count {
        font-size: 1rem;
        font-weight: 400;
        color: #666;
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    text-align: center;

    mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #bdbdbd;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.25rem;
      font-weight: 500;
      color: #424242;
      margin: 0 0 0.5rem 0;
    }

    span {
      font-size: 0.875rem;
      color: #757575;
    }
  }

  .orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .order-card-wrapper {
    display: block;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .orders-container {
    padding: 1rem;
  }

  .orders-header .title {
    font-size: 1.5rem;
  }

  .create-order-section .order-form {
    grid-template-columns: 1fr;
  }

  .orders-list-section .orders-grid {
    grid-template-columns: 1fr;
  }
}

// === ARCHIVO: client/src/app/shared/components/order-card/order-card.component.ts ===
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../../../core/models/order.model';
import { OrderStatusComponent } from '../order-status/order-status.component';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    OrderStatusComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="order-card">
      <mat-card-header>
        <mat-card-title>Order #{{ order.id }}</mat-card-title>
        <mat-card-subtitle>{{ order.customerId }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="order-details">
          <div class="detail-row">
            <span class="label">Product:</span>
            <span class="value">{{ order.productId }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Quantity:</span>
            <span class="value quantity-badge">{{ order.quantity }}</span>
          </div>
          
          <div class="detail-row" *ngIf="order.total">
            <span class="label">Total:</span>
            <span class="value price">{{ order.total | currency }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Status:</span>
            <app-order-status [status]="order.status"></app-order-status>
          </div>
          
          <div class="detail-row" *ngIf="order.createdAt">
            <span class="label">Created:</span>
            <span class="value">{{ order.createdAt | date:'medium' }}</span>
          </div>
          
          <div class="detail-row" *ngIf="order.updatedAt">
            <span class="label">Updated:</span>
            <span class="value">{{ order.updatedAt | date:'medium' }}</span>
          </div>
        </div>
        
        <mat-chip-set class="status-chips" *ngIf="order.tags?.length">
          <mat-chip *ngFor="let tag of order.tags" class="tag-chip">
            <mat-icon class="chip-icon">{{ getTagIcon(tag) }}</mat-icon>
            {{ tag }}
          </mat-chip>
        </mat-chip-set>
      </mat-card-content>
      
      <mat-card-actions align="end">
        <button mat-button color="primary" (click)="onViewDetails()">
          <mat-icon>visibility</mat-icon>
          View Details
        </button>
        <button mat-button color="accent" (click)="onTrackOrder()">
          <mat-icon>local_shipping</mat-icon>
          Track
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .order-card {
      margin: 16px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .order-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .order-card mat-card-header {
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      color: white;
      padding: 16px;
      margin: -16px -16px 16px -16px;
    }
    
    .order-card mat-card-title {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .order-card mat-card-subtitle {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .order-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .detail-row:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 500;
      color: #666;
      font-size: 0.875rem;
    }
    
    .value {
      font-weight: 600;
      color: #333;
    }
    
    .quantity-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-weight: 700;
    }
    
    .price {
      color: #2e7d32;
      font-size: 1.1rem;
    }
    
    .status-chips {
      margin-top: 16px;
    }
    
    .tag-chip {
      font-size: 0.75rem;
    }
    
    .chip-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    
    mat-card-actions button {
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    mat-card-actions mat-icon {
      margin-right: 4px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
  @Input() showActions: boolean = true;

  getTagIcon(tag: string): string {
    const iconMap: Record<string, string> = {
      'urgent': 'priority_high',
      'new': 'fiber_new',
      'processing': 'sync',
      'shipped': 'local_shipping',
      'delivered': 'check_circle',
      'cancelled': 'cancel'
    };
    return iconMap[tag.toLowerCase()] || 'label';
  }

  onViewDetails(): void {
    console.log('View order details:', this.order.id);
  }

  onTrackOrder(): void {
    console.log('Track order:', this.order.id);
  }
}

// === ARCHIVO: client/src/app/shared/components/order-status/order-status.component.ts ===
import { Component, Input, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

type OrderStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  animation: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="status-container" [class]="statusClass()">
      <div class="status-indicator" [class]="animationClass()">
        <mat-icon class="status-icon">{{ currentConfig().icon }}</mat-icon>
      </div>
      <span class="status-label">{{ currentConfig().label }}</span>
    </div>
  `,
  styles: [`
    .status-container {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
    }
    
    .status-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .status-label {
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Status: Pending */
    .status-pending {
      background: #fff3e0;
      color: #e65100;
      border: 1px solid #ffb74d;
    }
    
    .status-pending .status-indicator {
      background: #ffe0b2;
    }
    
    .status-pending .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    /* Status: Processing */
    .status-processing {
      background: #e3f2fd;
      color: #1565c0;
      border: 1px solid #64b5f6;
    }
    
    .status-processing .status-indicator {
      background: #bbdefb;
    }
    
    .status-processing .animate-spin {
      animation: spin 1.5s linear infinite;
    }
    
    /* Status: Shipped */
    .status-shipped {
      background: #f3e5f5;
      color: #7b1fa2;
      border: 1px solid #ba68c8;
    }
    
    .status-shipped .status-indicator {
      background: #e1bee7;
    }
    
    .status-shipped .animate-bounce {
      animation: bounce 1s ease-in-out infinite;
    }
    
    /* Status: Delivered */
    .status-delivered {
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #81c784;
    }
    
    .status-delivered .status-indicator {
      background: #c8e6c9;
    }
    
    .status-delivered .animate-scale {
      animation: scale 0.5s ease-out;
    }
    
    /* Status: Cancelled */
    .status-cancelled {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
    
    .status-cancelled .status-indicator {
      background: #ffcdd2;
    }
    
    .status-cancelled .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    /* Status: Refunded */
    .status-refunded {
      background: #fce4ec;
      color: #ad1457;
      border: 1px solid #f48fb1;
    }
    
    .status-refunded .status-indicator {
      background: #f8bbd9;
    }
    
    .status-refunded .animate-fade {
      animation: fade 1s ease-in-out;
    }
    
    /* Animations */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    
    @keyframes scale {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    
    @keyframes fade {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
    }
  `]
})
export class OrderStatusComponent {
  private readonly status = signal<OrderStatusType>('pending');
  
  private readonly statusConfigs: Record<OrderStatusType, StatusConfig> = {
    pending: {
      label: 'Pending',
      color: '#e65100',
      bgColor: '#fff3e0',
      icon: 'schedule',
      animation: 'animate-pulse'
    },
    processing: {
      label: 'Processing',
      color: '#1565c0',
      bgColor: '#e3f2fd',
      icon: 'sync',
      animation: 'animate-spin'
    },
    shipped: {
      label: 'Shipped',
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
      icon: 'local_shipping',
      animation: 'animate-bounce'
    },
    delivered: {
      label: 'Delivered',
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      icon: 'check_circle',
      animation: 'animate-scale'
    },
    cancelled: {
      label: 'Cancelled',
      color: '#c62828',
      bgColor: '#ffebee',
      icon: 'cancel',
      animation: 'animate-shake'
    },
    refunded: {
      label: 'Refunded',
      color: '#ad1457',
      bgColor: '#fce4ec',
      icon: 'replay',
      animation: 'animate-fade'
    }
  };

  @Input()
  set status(value: string) {
    const normalizedStatus = this.normalizeStatus(value);
    this.status.set(normalizedStatus);
  }

  readonly currentConfig = computed(() => {
    return this.statusConfigs[this.status()];
  });

  readonly statusClass = computed(() => {
    return `status-${this.status()}`;
  });

  readonly animationClass = computed(() => {
    return this.currentConfig().animation;
  });

  private normalizeStatus(value: string): OrderStatusType {
    const normalized = value?.toLowerCase().trim() as OrderStatusType;
    const validStatuses: OrderStatusType[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    return validStatuses.includes(normalized) ? normalized : 'pending';
  }
}

// === ARCHIVO: client/src/environments/environment.ts ===
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

// === ARCHIVO: client/src/app/core/types/order-status.type.ts ===
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

// === ARCHIVO: client/src/app/core/services/auth.service.ts ===
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  id: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly currentUserRoles = computed(() => this.currentUser()?.roles ?? []);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(email: string, password: string): boolean {
    if (email && password.length >= 4) {
      const user: User = {
        id: crypto.randomUUID(),
        email,
        roles: ['user']
      };
      
      if (email.includes('admin')) {
        user.roles.push('admin');
      }
      
      this.currentUser.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.currentUserRoles().includes(role);
  }

  getUser(): User | null {
    return this.currentUser();
  }

  getUserEmail(): string {
    return this.currentUser()?.email ?? '';
  }

  getUserId(): string {
    return this.currentUser()?.id ?? '';
  }
}

// === ARCHIVO: client/src/app/features/orders/order-detail/order-detail.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderEvent } from '../../../core/models/order.model';
import { OrderStatusComponent } from '../../../shared/components/order-status/order-status.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    OrderStatusComponent
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private destroy$ = new Subject<void>();

  orderId = signal<string>('');
  order = signal<Order | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string>('');
  orderTimeline = signal<OrderEvent[]>([]);

  readonly hasOrder = computed(() => this.order() !== null);
  readonly pageTitle = computed(() => `Pedido ${this.orderId()}`);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId.set(id);
      this.loadOrder(id);
    } else {
      this.error.set('ID de pedido no proporcionado');
      this.isLoading.set(false);
    }

    this.orderService.orders
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        const found = orders.find(o => o.id === this.orderId());
        if (found) {
          this.order.set(found);
          this.isLoading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrder(id: string): void {
    const existingOrder = this.orderService.orders().find(o => o.id === id);
    if (existingOrder) {
      this.order.set(existingOrder);
      this.isLoading.set(false);
    } else {
      setTimeout(() => {
        if (!this.order()) {
          this.error.set('Pedido no encontrado');
          this.isLoading.set(false);
        }
      }, 2000);
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  refreshOrder(): void {
    const id = this.orderId();
    if (id) {
      this.isLoading.set(true);
      this.error.set('');
      this.loadOrder(id);
    }
  }

  getStatusClass(): string {
    const status = this.order()?.status;
    if (!status) return '';
    
    const statusClasses: Record<string, string> = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded'
    };
    return statusClasses[status] || '';
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}

// === ARCHIVO: client/src/app/features/analytics/analytics.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';
import { OrderStatusComponent } from '../../shared/components/order-status/order-status.component';

interface AnalyticsMetric {
  label: string;
  value: number;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface ChartDataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OrderStatusComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private readonly orderService = inject(OrderService);
  
  readonly isLoading = signal<boolean>(true);
  readonly lastUpdated = signal<Date | null>(null);
  readonly refreshInterval = signal<ReturnType<typeof setInterval> | null>(null);
  
  readonly totalOrders = computed<number>(() => {
    return this.orderService.orders().length;
  });
  
  readonly pendingOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'pending').length;
  });
  
  readonly processingOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'processing').length;
  });
  
  readonly deliveredOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'delivered').length;
  });
  
  readonly cancelledOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'cancelled').length;
  });
  
  readonly metrics = computed<AnalyticsMetric[]>(() => [
    {
      label: 'Total de Órdenes',
      value: this.totalOrders(),
      icon: 'shopping_cart',
      color: '#1976d2',
      trend: 'up'
    },
    {
      label: 'Pendientes',
      value: this.pendingOrders(),
      icon: 'hourglass_empty',
      color: '#ff9800'
    },
    {
      label: 'En Proceso',
      value: this.processingOrders(),
      icon: 'sync',
      color: '#2196f3'
    },
    {
      label: 'Entregadas',
      value: this.deliveredOrders(),
      icon: 'check_circle',
      color: '#4caf50',
      trend: 'up'
    },
    {
      label: 'Canceladas',
      value: this.cancelledOrders(),
      icon: 'cancel',
      color: '#f44336'
    }
  ]);
  
  readonly ordersByStatus = computed<ChartDataPoint[]>(() => {
    const orders = this.orderService.orders();
    const statusCounts = new Map<string, number>();
    
    orders.forEach(order => {
      const current = statusCounts.get(order.status) || 0;
      statusCounts.set(order.status, current + 1);
    });
    
    return Array.from(statusCounts.entries()).map(([label, value]) => ({
      label: this.formatStatusLabel(label),
      value
    }));
  });
  
  readonly recentOrders = computed<Order[]>(() => {
    return [...this.orderService.orders()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  });
  
  readonly averageProcessingTime = computed<number>(() => {
    const delivered = this.orderService.orders().filter(o => o.status === 'delivered');
    if (delivered.length === 0) return 0;
    
    const totalTime = delivered.reduce((sum, order) => {
      const created = new Date(order.createdAt).getTime();
      const updated = new Date(order.updatedAt).getTime();
      return sum + (updated - created);
    }, 0);
    
    return Math.round(totalTime / delivered.length / 60000);
  });
  
  ngOnInit(): void {
    this.loadAnalyticsData();
    this.startAutoRefresh();
  }
  
  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }
  
  private loadAnalyticsData(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.lastUpdated.set(new Date());
      this.isLoading.set(false);
    }, 500);
  }
  
  private startAutoRefresh(): void {
    const interval = setInterval(() => {
      this.loadAnalyticsData();
    }, 30000);
    this.refreshInterval.set(interval);
  }
  
  private stopAutoRefresh(): void {
    const interval = this.refreshInterval();
    if (interval) {
      clearInterval(interval);
      this.refreshInterval.set(null);
    }
  }
  
  refreshData(): void {
    this.loadAnalyticsData();
  }
  
  private formatStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'En Proceso',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado'
    };
    return labels[status] || status;
  }
  
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}

// === ARCHIVO: client/src/app/features/auth/login/login.component.ts ===
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly router = inject(Router);
  
  readonly isLoading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly validationErrors = signal<ValidationError[]>([]);
  
  readonly formData = signal<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  readonly emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly minPasswordLength = 8;
  
  onEmailChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(form => ({ ...form, email: value }));
    this.clearFieldError('email');
  }
  
  onPasswordChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(form => ({ ...form, password: value }));
    this.clearFieldError('password');
  }
  
  onRememberMeChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.formData.update(form => ({ ...form, rememberMe: checked }));
  }
  
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }
  
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    try {
      await this.performLogin();
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  private validateForm(): boolean {
    const errors: ValidationError[] = [];
    const { email, password } = this.formData();
    
    if (!email || !this.emailRegex.test(email)) {
      errors.push({
        field: 'email',
        message: 'Por favor ingresa un correo electrónico válido'
      });
    }
    
    if (!password || password.length < this.minPasswordLength) {
      errors.push({
        field: 'password',
        message: `La contraseña debe tener al menos ${this.minPasswordLength} caracteres`
      });
    }
    
    if (errors.length > 0) {
      this.validationErrors.set(errors);
      return false;
    }
    
    return true;
  }
  
  private async performLogin(): Promise<void> {
    const { email, password, rememberMe } = this.formData();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validCredentials = [
      { email: 'admin@ecommerce.com', password: 'admin123', role: 'admin' },
      { email: 'user@ecommerce.com', password: 'user123', role: 'user' }
    ];
    
    const found = validCredentials.find(
      c => c.email === email && c.password === password
    );
    
    if (found) {
      this.storeAuthToken(found.role, rememberMe);
      this.navigateAfterLogin(found.role);
    } else {
      throw new Error('Credenciales inválidas. Por favor verifica tu correo y contraseña.');
    }
  }
  
  private storeAuthToken(role: string, rememberMe: boolean): void {
    const token = btoa(`${role}:${Date.now()}`);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_token', token);
    storage.setItem('user_role', role);
  }
  
  private navigateAfterLogin(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/analytics']);
    } else {
      this.router.navigate(['/orders']);
    }
  }
  
  private handleLoginError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    this.errorMessage.set(message);
  }
  
  private clearFieldError(field: string): void {
    this.validationErrors.update(errors => 
      errors.filter(e => e.field !== field)
    );
  }
  
  getFieldError(field: string): string | undefined {
    return this.validationErrors().find(e => e.field === field)?.message;
  }
  
  hasFieldError(field: string): boolean {
    return this.validationErrors().some(e => e.field === field);
  }
  
  clearError(): void {
    this.errorMessage.set(null);
  }
}

// === ARCHIVO: client/src/app/features/auth/unauthorized/unauthorized.component.ts ===
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface UnauthorizedAction {
  label: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  private readonly router = inject(Router);
  
  readonly pageTitle = 'Acceso Denegado';
  readonly pageSubtitle = 'No tienes los permisos necesarios para acceder a esta sección';
  readonly errorCode = 403;
  readonly timestamp = new Date().toISOString();
  
  readonly availableActions: UnauthorizedAction[] = [
    {
      label: 'Volver al Inicio',
      route: '/orders',
      icon: 'home',
      description: 'Regresa a la página principal de órdenes'
    },
    {
      label: 'Ver mis Órdenes',
      route: '/orders',
      icon: 'shopping_cart',
      description: 'Accede a tus órdenes personalizadas'
    },
    {
      label: 'Cerrar Sesión',
      route: '/login',
      icon: 'logout',
      description: 'Inicia sesión con otras credenciales'
    }
  ];
  
  navigateTo(route: string): void {
    if (route === '/login') {
      this.clearAuthData();
    }
    this.router.navigate([route]);
  }
  
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_role');
  }
  
  refreshPage(): void {
    window.location.reload();
  }
  
  getErrorDetails(): string {
    return `Error ${this.errorCode}: Forbidden - You do not have permission to access this resource.`;
  }
  
  contactSupport(): void {
    const supportEmail = 'soporte@ecommerce.com';
    const subject = encodeURIComponent('Acceso denegado - Solicitud de permisos');
    const body = encodeURIComponent(
      `He intentado acceder a una sección restringida y recibí un error de acceso denegado.\n\n` +
      `Timestamp: ${this.timestamp}\n` +
      `Error: ${this.getErrorDetails()}`
    );
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  }
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
