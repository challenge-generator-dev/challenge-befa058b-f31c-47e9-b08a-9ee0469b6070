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