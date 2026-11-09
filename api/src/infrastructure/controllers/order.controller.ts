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