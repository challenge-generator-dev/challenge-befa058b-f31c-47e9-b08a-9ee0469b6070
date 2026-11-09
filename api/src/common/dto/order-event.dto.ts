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